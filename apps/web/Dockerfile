FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory to monorepo root
WORKDIR /app

# Copy workspace configuration files first
COPY package.json pnpm-workspace.yaml ./

# Copy lockfile if it exists (use wildcard to avoid error if missing)
COPY pnpm-lock.yaml* ./

# Copy packages
COPY packages ./packages

# Copy Web app
COPY apps/web ./apps/web

# Verify lockfile exists and install dependencies
RUN if [ -f pnpm-lock.yaml ]; then \
      echo "Lockfile found, using frozen-lockfile"; \
      pnpm install --frozen-lockfile; \
    else \
      echo "No lockfile found, installing normally"; \
      pnpm install; \
    fi

# Build the web app
WORKDIR /app/apps/web
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the server
CMD ["pnpm", "preview"]

