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
RUN pnpm build

# Build argument
ARG APP=api
ENV APP=${APP}

# Build based on APP
WORKDIR /app
RUN if [ "$APP" = "api" ]; then \
      echo "Building API..." && \
      cd apps/api && \
      pnpm build; \
    elif [ "$APP" = "web" ]; then \
      echo "Building Web..." && \
      cd apps/web && \
      pnpm build; \
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
