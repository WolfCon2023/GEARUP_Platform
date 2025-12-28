# Immediate Fix for Railway Deployment

## The Issue
Railway is still using Nixpacks auto-generated Dockerfile instead of our custom Dockerfile, or the pnpm-lock.yaml is still missing.

## Step-by-Step Fix

### Step 1: Create pnpm-lock.yaml (REQUIRED)

Run this in your project root:

```bash
pnpm install
```

This will create `pnpm-lock.yaml` in the root directory.

### Step 2: Commit and Push

```bash
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
git push
```

### Step 3: Configure Railway to Use Dockerfile

**For API Service:**
1. Go to Railway dashboard
2. Click on your **API service**
3. Go to **Settings** → **Build & Deploy**
4. Under **Builder**, change from `NIXPACKS` to `DOCKERFILE`
5. Set **Dockerfile Path** to: `apps/api/Dockerfile`
6. Set **Root Directory** to: `apps/api` (or leave empty if using full path in Dockerfile)
7. Click **Save**

**For Web Service:**
1. Click on your **Web service**
2. Go to **Settings** → **Build & Deploy**
3. Under **Builder**, change from `NIXPACKS` to `DOCKERFILE`
4. Set **Dockerfile Path** to: `apps/web/Dockerfile`
5. Set **Root Directory** to: `apps/web` (or leave empty)
6. Click **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic redeploy

## Alternative: Quick Fix Without Dockerfile

If you want to keep using Nixpacks, update the build command in Railway:

**For API Service:**
- **Build Command**: `npm install -g pnpm && cd ../.. && pnpm install --no-frozen-lockfile && pnpm --filter api build`

**For Web Service:**
- **Build Command**: `npm install -g pnpm && cd ../.. && pnpm install --no-frozen-lockfile && pnpm --filter web build`

But **creating pnpm-lock.yaml is still recommended** for reproducible builds.

## Verify

After completing the steps:
1. Check Railway logs - should see successful `pnpm install`
2. Build should complete without errors
3. Service should start successfully



