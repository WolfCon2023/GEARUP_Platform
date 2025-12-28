FROM node:18-alpine

RUN npm i -g pnpm

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy workspace packages
COPY packages/shared ./packages/shared
COPY apps ./apps

# Install workspace deps
RUN pnpm install --frozen-lockfile

# Build shared first, then build based on APP
ARG APP=api
ENV APP=${APP}

RUN pnpm -C packages/shared build

RUN if [ "$APP" = "api" ]; then \
      pnpm -C apps/api build; \
    elif [ "$APP" = "web" ]; then \
      pnpm -C apps/web build; \
    else \
      echo "ERROR: APP must be 'api' or 'web'" && exit 1; \
    fi

EXPOSE 3000

WORKDIR /app/apps/${APP}
CMD if [ "$APP" = "api" ]; then \
      pnpm start; \
    elif [ "$APP" = "web" ]; then \
      pnpm run preview:railway; \
    else \
      echo "ERROR: APP must be 'api' or 'web'"; \
      exit 1; \
    fi
