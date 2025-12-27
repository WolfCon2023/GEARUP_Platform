# Railway Deployment - Fixed Configuration

## The Problem
Railway was failing with: `/bin/bash: line 1: pnpm: command not found`

This happens because Railway's Nixpacks doesn't automatically install pnpm for monorepos.

## The Solution

I've created multiple solutions. Choose the one that works best:

### Solution 1: Use Dockerfile (Recommended - Most Reliable)

The Dockerfiles have been created in:
- `apps/api/Dockerfile`
- `apps/web/Dockerfile`

**Steps:**
1. In Railway, go to your service settings
2. Go to **Settings** → **Build & Deploy**
3. Change **Builder** from `NIXPACKS` to `DOCKERFILE`
4. Set **Dockerfile Path** to:
   - For API: `apps/api/Dockerfile`
   - For Web: `apps/web/Dockerfile`
5. Set **Root Directory** to:
   - For API: `apps/api`
   - For Web: `apps/web`
6. Redeploy

### Solution 2: Use Nixpacks with Updated Config

The `nixpacks.toml` files are configured to install pnpm.

**Steps:**
1. Make sure `pnpm-lock.yaml` exists in the root (run `pnpm install` locally and commit it)
2. In Railway service settings:
   - **Root Directory**: `apps/api` (or `apps/web`)
   - **Builder**: `NIXPACKS` (should auto-detect `nixpacks.toml`)
3. Redeploy

### Solution 3: Manual Build Commands

If the above don't work, set these in Railway service settings:

**For API Service:**
- **Root Directory**: Leave empty (or set to project root)
- **Build Command**: `cd apps/api && npm install -g pnpm && cd ../.. && pnpm install && pnpm --filter api build`
- **Start Command**: `cd apps/api && pnpm start`

**For Web Service:**
- **Root Directory**: Leave empty (or set to project root)
- **Build Command**: `cd apps/web && npm install -g pnpm && cd ../.. && pnpm install && pnpm --filter web build`
- **Start Command**: `cd apps/web && pnpm preview`

## Important: Create pnpm-lock.yaml

If you don't have `pnpm-lock.yaml` in your repository root:

```bash
# In project root
pnpm install

# Commit the lock file
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml for Railway deployment"
git push
```

Railway needs this file to properly detect and use pnpm.

## Verify Setup

After deploying:

1. Check Railway logs for any errors
2. Verify the build completes successfully
3. Check that the service starts and is accessible

## Quick Fix Checklist

- [ ] `pnpm-lock.yaml` exists in root and is committed
- [ ] Dockerfiles are in `apps/api/` and `apps/web/`
- [ ] Railway service Root Directory is set correctly
- [ ] Railway service Builder is set (DOCKERFILE or NIXPACKS)
- [ ] Environment variables are set (MONGODB_URI, JWT_SECRET, etc.)
- [ ] Redeploy after making changes

## Still Having Issues?

1. Check Railway build logs for specific errors
2. Try Solution 1 (Dockerfile) - it's the most reliable
3. Make sure all files are committed and pushed to GitHub
4. Verify your Railway project is connected to the correct GitHub repository

