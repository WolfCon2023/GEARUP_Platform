FROM node:18-alpine

RUN npm i -g pnpm

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy workspace packages
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install workspace deps
RUN pnpm install --frozen-lockfile

# Build shared first, then API
RUN pnpm -C packages/shared build
RUN pnpm -C apps/api build

EXPOSE 3000

WORKDIR /app/apps/api
CMD ["pnpm", "start"]
