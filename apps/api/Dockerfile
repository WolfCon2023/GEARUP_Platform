FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy all files from project root (Railway will set build context)
# Copy root package files
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy API app
COPY apps/api ./apps/api

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
      echo "✓ Lockfile found, using frozen-lockfile"; \
      pnpm install --frozen-lockfile; \
    else \
      echo "⚠ No lockfile found, installing normally"; \
      pnpm install; \
    fi

# Build the API
WORKDIR /app/apps/api
RUN pnpm build

# Expose port
EXPOSE 3001

# Start the server
WORKDIR /app/apps/api
CMD ["pnpm", "start"]
