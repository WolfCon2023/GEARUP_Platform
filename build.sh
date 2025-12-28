#!/bin/sh
# Simple build script for Railway

# Install pnpm if not present
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi

# Install dependencies
pnpm install --frozen-lockfile

# Build based on APP environment variable
if [ "$APP" = "api" ]; then
  echo "Building API..."
  cd apps/api
  pnpm build
  echo "API build complete"
elif [ "$APP" = "web" ]; then
  echo "Building Web..."
  cd apps/web
  pnpm build
  echo "Web build complete"
else
  echo "ERROR: APP environment variable not set. Set APP=api or APP=web"
  exit 1
fi



