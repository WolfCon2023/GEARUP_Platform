# Web Service Dockerfile
# This Dockerfile assumes Railway's build context is the PROJECT ROOT
# Set Root Directory to EMPTY in Railway settings

FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory to project root
WORKDIR /app

# Copy root package files (needed for workspace)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy shared package (dependency of Web)
COPY packages/shared ./packages/shared

# Copy Web app
COPY apps/web ./apps/web

# Install all dependencies (from root, handles workspaces)
RUN pnpm install --frozen-lockfile

# Build shared package first (if it has a build step)
WORKDIR /app/packages/shared
RUN pnpm build || echo "No build script in shared package"

# Build Web app
WORKDIR /app/apps/web
RUN pnpm build

# Expose port
EXPOSE 3000

# Set working directory for runtime
WORKDIR /app/apps/web

# Start the web server
CMD ["pnpm", "preview"]
