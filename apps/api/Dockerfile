FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory to monorepo root
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies from root
RUN pnpm install --frozen-lockfile

# Build the API
WORKDIR /app/apps/api
RUN pnpm build

# Expose port
EXPOSE 3001

# Start the server
CMD ["pnpm", "start"]

