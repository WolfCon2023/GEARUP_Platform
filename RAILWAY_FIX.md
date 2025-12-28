# Railway Deployment Fix

## Issue
Railway build fails with: `/bin/bash: line 1: pnpm: command not found`

## Solution

Railway needs to be configured to:
1. Install pnpm in the build environment
2. Handle the monorepo structure correctly

## Steps to Fix

### Option 1: Use Nixpacks Configuration (Recommended)

The `nixpacks.toml` files have been created in:
- `apps/api/nixpacks.toml`
- `apps/web/nixpacks.toml`

These tell Railway to:
- Install Node.js 18 and pnpm
- Install dependencies from the monorepo root
- Build and start correctly

### Option 2: Update Railway Service Settings

1. Go to your Railway project
2. Click on the API service
3. Go to **Settings** → **Build & Deploy**
4. Set:
   - **Root Directory**: `apps/api`
   - **Build Command**: `cd ../.. && pnpm install && cd apps/api && pnpm build`
   - **Start Command**: `pnpm start`

5. For the Web service:
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - **Start Command**: `pnpm preview`

### Option 3: Create pnpm-lock.yaml (If Missing)

If you don't have a `pnpm-lock.yaml` file:

```bash
# In project root
pnpm install
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
git push
```

### Option 4: Use Dockerfile (Alternative)

If Nixpacks still doesn't work, create a Dockerfile in `apps/api/`:

```dockerfile
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
WORKDIR /app/apps/api
RUN pnpm build

# Start
CMD ["pnpm", "start"]
```

Then in Railway settings, set **Builder** to `DOCKERFILE` instead of `NIXPACKS`.

## Verify Fix

After updating, trigger a new deployment:
1. Go to Railway dashboard
2. Click on your service
3. Go to **Deployments**
4. Click **Redeploy** or push a new commit

## Common Issues

### Issue: Still can't find pnpm
- Make sure `nixpacks.toml` is in the service root directory
- Check that Railway is using Nixpacks builder (not Dockerfile)
- Verify the Root Directory is set correctly

### Issue: Workspace dependencies not found
- Ensure `pnpm-lock.yaml` exists in the root
- Make sure build command runs from monorepo root first
- Check that `packages/shared` is accessible

### Issue: Build succeeds but start fails
- Verify `startCommand` in `railway.json` or service settings
- Check that `dist/` folder exists after build
- Ensure all environment variables are set



