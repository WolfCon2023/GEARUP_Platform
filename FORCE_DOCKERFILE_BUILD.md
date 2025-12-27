# Force Railway to Use Dockerfile - Step by Step

## The Problem
Railway is still using Nixpacks (auto-generated Dockerfile) instead of our custom Dockerfile. The error shows Nixpacks is trying to use `--frozen-lockfile` without checking if the file exists.

## Solution: Explicitly Set Dockerfile Builder

### Step 1: Go to Railway Dashboard

1. Open https://railway.app
2. Login and go to your project

### Step 2: Configure API Service

1. Click on your **API service** (the one that's failing)
2. Click **Settings** (gear icon or Settings tab)
3. Scroll to **Build & Deploy** section
4. Find **Builder** dropdown - it probably says `NIXPACKS`
5. **Change it to `DOCKERFILE`**
6. Set **Dockerfile Path** to: `apps/api/Dockerfile`
7. Set **Root Directory** to: **LEAVE EMPTY** (this makes Railway use project root as build context)
8. **Build Command**: Leave empty (Dockerfile handles it)
9. **Start Command**: `pnpm start`
10. Click **Save** or **Update**

### Step 3: Configure Web Service

1. Click on your **Web service**
2. Click **Settings**
3. Scroll to **Build & Deploy** section
4. Change **Builder** from `NIXPACKS` to `DOCKERFILE`
5. Set **Dockerfile Path** to: `apps/web/Dockerfile`
6. Set **Root Directory** to: **LEAVE EMPTY**
7. **Build Command**: Leave empty
8. **Start Command**: `pnpm preview`
9. Click **Save**

### Step 4: Redeploy

After saving settings:

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or wait for automatic redeploy (if enabled)

### Step 5: Verify

Check the build logs. You should see:
- ✅ "Installing pnpm" (from our Dockerfile)
- ✅ "Lockfile found, using frozen-lockfile" (from our Dockerfile)
- ✅ Build completes successfully

If you still see Nixpacks commands, the builder wasn't changed correctly.

## Alternative: If Dockerfile Builder Doesn't Appear

If you don't see `DOCKERFILE` as an option:

1. Make sure Dockerfiles exist in `apps/api/` and `apps/web/`
2. Try setting **Root Directory** to project root (empty or `/`)
3. Try **Dockerfile Path** as just `Dockerfile` (if root is set to `apps/api`)

## Still Not Working?

### Option A: Use Build Commands (Workaround)

If Dockerfile builder still doesn't work, use Nixpacks with custom build commands:

**For API:**
- **Builder**: `NIXPACKS`
- **Root Directory**: Leave empty (project root)
- **Build Command**: 
  ```bash
  npm install -g pnpm && pnpm install && pnpm --filter api build
  ```
- **Start Command**: `cd apps/api && pnpm start`

**For Web:**
- **Builder**: `NIXPACKS`  
- **Root Directory**: Leave empty
- **Build Command**: 
  ```bash
  npm install -g pnpm && pnpm install && pnpm --filter web build
  ```
- **Start Command**: `cd apps/web && pnpm preview`

### Option B: Check File Structure

Verify these files exist in your repo:
- ✅ `pnpm-lock.yaml` (in root)
- ✅ `apps/api/Dockerfile`
- ✅ `apps/web/Dockerfile`
- ✅ `package.json` (in root)
- ✅ `pnpm-workspace.yaml` (in root)

## Quick Checklist

- [ ] Changed Builder to `DOCKERFILE` in Railway settings
- [ ] Set Dockerfile Path correctly
- [ ] Root Directory is empty (project root)
- [ ] Saved settings
- [ ] Triggered redeploy
- [ ] Checked build logs for Dockerfile commands (not Nixpacks)

