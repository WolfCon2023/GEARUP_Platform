# API Service Dockerfile
# This Dockerfile assumes Railway's build context is the PROJECT ROOT
# Set Root Directory to EMPTY in Railway settings

FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory to project root
WORKDIR /app

# Copy root package files (needed for workspace)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy shared package (dependency of API)
COPY packages/shared ./packages/shared

# Copy API app
COPY apps/api ./apps/api

# Install all dependencies (from root, handles workspaces)
RUN pnpm install --frozen-lockfile

# Build shared package first (if it has a build step)
WORKDIR /app/packages/shared
RUN pnpm build || echo "No build script in shared package"

# Build API app
WORKDIR /app/apps/api
RUN pnpm build

# Expose port
EXPOSE 3001

# Set working directory for runtime
WORKDIR /app/apps/api

# Start the API server
CMD ["pnpm", "start"]
