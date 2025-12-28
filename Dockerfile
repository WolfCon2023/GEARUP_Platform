FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy apps
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first (REQUIRED - must be built before API/Web)
WORKDIR /app/packages/shared
RUN echo "Building shared package..." && \
    pnpm build && \
    echo "Shared package built. Verifying:" && \
    ls -la dist/ && \
    test -f dist/index.js && echo "✓ dist/index.js exists" || (echo "✗ dist/index.js missing" && exit 1) && \
    test -f dist/index.d.ts && echo "✓ dist/index.d.ts exists" || (echo "✗ dist/index.d.ts missing" && exit 1)

# Reinstall to ensure workspace links are correct after building shared package
WORKDIR /app
RUN pnpm install --frozen-lockfile

# Verify shared package is linked correctly
RUN echo "Checking workspace link:" && \
    ls -la node_modules/@northstar/ 2>/dev/null || echo "Workspace link check" && \
    cd apps/api && \
    pnpm list @northstar/shared || echo "Package check"

# Build argument
ARG APP=api
ENV APP=${APP}

# Build based on APP
WORKDIR /app
RUN if [ "$APP" = "api" ]; then \
      echo "Building API from root..." && \
      pnpm --filter api build; \
    elif [ "$APP" = "web" ]; then \
      echo "Building Web from root..." && \
      pnpm --filter web build; \
    else \
      echo "ERROR: APP must be 'api' or 'web'" && \
      exit 1; \
    fi

# Expose port
EXPOSE 3001

# Start based on APP
WORKDIR /app
CMD if [ "$APP" = "api" ]; then \
      cd apps/api && pnpm start; \
    elif [ "$APP" = "web" ]; then \
      cd apps/web && pnpm preview; \
    else \
      echo "ERROR: APP must be 'api' or 'web'"; \
      exit 1; \
    fi
