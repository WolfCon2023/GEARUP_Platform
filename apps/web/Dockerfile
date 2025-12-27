FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory to monorepo root
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies from root
# If pnpm-lock.yaml exists, use frozen-lockfile, otherwise install normally
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# Build the web app
WORKDIR /app/apps/web
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the server
CMD ["pnpm", "preview"]

