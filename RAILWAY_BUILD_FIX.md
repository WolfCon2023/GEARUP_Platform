# Railway Build Fix - Complete Solution

## The Problem
Railway builds are still failing even with pnpm-lock.yaml because Railway might be:
1. Still using Nixpacks instead of Dockerfile
2. Not detecting the Dockerfile correctly
3. Using wrong build context

## Complete Fix Steps

### Step 1: Verify Railway Service Settings

**For API Service:**
1. Go to Railway dashboard
2. Click on **API service**
3. Go to **Settings** → **Build & Deploy**
4. Verify these settings:
   - **Root Directory**: `apps/api` (or leave empty)
   - **Builder**: `DOCKERFILE` (NOT Nixpacks)
   - **Dockerfile Path**: `apps/api/Dockerfile` (or just `Dockerfile` if root is `apps/api`)
   - **Build Command**: Leave empty (Dockerfile handles it)
   - **Start Command**: `pnpm start`

**For Web Service:**
1. Click on **Web service**
2. Go to **Settings** → **Build & Deploy**
3. Verify these settings:
   - **Root Directory**: `apps/web` (or leave empty)
   - **Builder**: `DOCKERFILE` (NOT Nixpacks)
   - **Dockerfile Path**: `apps/web/Dockerfile` (or just `Dockerfile` if root is `apps/web`)
   - **Build Command**: Leave empty
   - **Start Command**: `pnpm preview`

### Step 2: Alternative - Use Root Directory Approach

If the above doesn't work, try setting Root Directory to project root:

**For API Service:**
- **Root Directory**: Leave **EMPTY** (project root)
- **Dockerfile Path**: `apps/api/Dockerfile`
- **Builder**: `DOCKERFILE`

**For Web Service:**
- **Root Directory**: Leave **EMPTY** (project root)
- **Dockerfile Path**: `apps/web/Dockerfile`
- **Builder**: `DOCKERFILE`

### Step 3: Check Build Logs

After redeploying, check the logs:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. View **Build Logs**
4. Look for:
   - ✅ "Installing pnpm" - Good
   - ✅ "pnpm install" - Good
   - ❌ "ERR_PNPM_NO_LOCKFILE" - Still an issue
   - ❌ "command not found" - Builder issue

### Step 4: Manual Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit (trigger file was created)

## If Still Failing

### Option A: Simplify Dockerfile Build Context

The Dockerfiles copy from monorepo root. If Railway's build context is different, we might need to adjust.

Try updating Railway settings:
- **Root Directory**: Leave EMPTY (use project root)
- **Dockerfile Path**: `apps/api/Dockerfile` or `apps/web/Dockerfile`

### Option B: Use Build Command Instead

If Dockerfile still doesn't work, use build commands:

**For API:**
- **Builder**: `NIXPACKS`
- **Root Directory**: `apps/api`
- **Build Command**: 
  ```bash
  npm install -g pnpm && cd ../.. && pnpm install && pnpm --filter api build
  ```
- **Start Command**: `cd apps/api && pnpm start`

**For Web:**
- **Builder**: `NIXPACKS`
- **Root Directory**: `apps/web`
- **Build Command**: 
  ```bash
  npm install -g pnpm && cd ../.. && pnpm install && pnpm --filter web build
  ```
- **Start Command**: `cd apps/web && pnpm preview`

## Verify Success

After fixing, you should see in build logs:
- ✅ pnpm installed successfully
- ✅ Dependencies installed
- ✅ Build completed
- ✅ Service started

## Next Steps

1. Update Railway service settings (Step 1)
2. Redeploy
3. Check logs
4. If still failing, try Option B (build commands)



