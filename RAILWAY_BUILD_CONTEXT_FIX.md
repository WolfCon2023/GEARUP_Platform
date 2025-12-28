# Railway Build Context Fix

## The Problem
Railway is using the wrong build context. The error `No package.json found in /` means the build is running from the wrong directory.

## Solution: Set Correct Build Context in Railway

### Critical Settings for API Service

1. Go to Railway Dashboard → API Service → Settings → Build & Deploy

2. **Set these EXACT values:**
   - **Root Directory**: `""` (EMPTY - this makes Railway use project root as build context)
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `apps/api/Dockerfile`
   - **Build Command**: `""` (EMPTY - let Dockerfile handle it)
   - **Start Command**: `pnpm start`

3. **IMPORTANT**: Root Directory MUST be empty. If it's set to `apps/api`, the build context is wrong.

### Critical Settings for Web Service

1. Go to Railway Dashboard → Web Service → Settings → Build & Deploy

2. **Set these EXACT values:**
   - **Root Directory**: `""` (EMPTY)
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `apps/web/Dockerfile`
   - **Build Command**: `""` (EMPTY)
   - **Start Command**: `pnpm preview`

## Why This Matters

When **Root Directory** is empty:
- Railway uses the **project root** as build context
- Dockerfile can access `package.json`, `pnpm-lock.yaml`, etc. from root
- Dockerfile paths like `COPY package.json ./` work correctly

When **Root Directory** is set to `apps/api`:
- Railway uses `apps/api` as build context
- Dockerfile can't access root files
- Build fails with "No package.json found"

## Step-by-Step Fix

1. ✅ Open Railway Dashboard
2. ✅ Click API Service → Settings → Build & Deploy
3. ✅ **Clear** Root Directory field (make it empty)
4. ✅ Set Builder to `DOCKERFILE`
5. ✅ Set Dockerfile Path to `apps/api/Dockerfile`
6. ✅ **Clear** Build Command field
7. ✅ Set Start Command to `pnpm start`
8. ✅ Click Save
9. ✅ Repeat for Web Service
10. ✅ Redeploy

## Verify It's Working

After redeploying, check build logs. You should see:
- ✅ "Installing pnpm" (from our Dockerfile)
- ✅ "✓ Lockfile found, using frozen-lockfile"
- ✅ "Packages: +XXX" (dependencies installing)
- ✅ Build completes successfully

If you see "No package.json found", the Root Directory is still set incorrectly.

## Alternative: If Dockerfile Builder Not Available

If you can't switch to Dockerfile builder, use Nixpacks with these settings:

**For API:**
- **Root Directory**: `""` (EMPTY)
- **Builder**: `NIXPACKS`
- **Build Command**: `pnpm install && pnpm --filter api build`
- **Start Command**: `cd apps/api && pnpm start`

**For Web:**
- **Root Directory**: `""` (EMPTY)
- **Builder**: `NIXPACKS`
- **Build Command**: `pnpm install && pnpm --filter web build`
- **Start Command**: `cd apps/web && pnpm preview`

**Note**: Remove `cd ../..` from build commands - they're not needed if Root Directory is empty.



