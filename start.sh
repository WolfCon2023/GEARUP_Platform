#!/bin/sh
# Simple start script for Railway

if [ "$APP" = "api" ]; then
  echo "Starting API..."
  cd apps/api
  pnpm start
elif [ "$APP" = "web" ]; then
  echo "Starting Web..."
  cd apps/web
  pnpm preview
else
  echo "ERROR: APP environment variable not set"
  exit 1
fi



