# URGENT: Railway Build Fix - Step by Step

## The Problem
Railway is using Nixpacks with a build command that tries to `cd ../..`, which fails because the build context is wrong.

## Solution: Fix Railway Settings

### Step 1: Go to Railway Dashboard
1. Open https://railway.app
2. Login to your account
3. Select your project

### Step 2: Fix API Service Settings

1. **Click on your API service** (the one failing)
2. **Click "Settings"** (gear icon or Settings tab)
3. **Scroll down to "Build & Deploy" section**

4. **Find these fields and set them EXACTLY:**
   - **Root Directory**: DELETE everything, leave it COMPLETELY EMPTY
   - **Builder**: Change from `NIXPACKS` to `DOCKERFILE`
   - **Dockerfile Path**: Type `apps/api/Dockerfile`
   - **Build Command**: DELETE everything, leave it COMPLETELY EMPTY
   - **Start Command**: Type `pnpm start`

5. **Click "Save" or "Update"**

### Step 3: Fix Web Service Settings

1. **Click on your Web service**
2. **Click "Settings"**
3. **Scroll to "Build & Deploy"**

4. **Set these EXACTLY:**
   - **Root Directory**: EMPTY (delete everything)
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `apps/web/Dockerfile`
   - **Build Command**: EMPTY (delete everything)
   - **Start Command**: `pnpm preview`

5. **Click "Save"**

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Watch the build logs

## If You Can't Find "Builder" Option

Some Railway interfaces hide the Builder option. Try:

1. Look for a dropdown or toggle that says "NIXPACKS" or "DOCKERFILE"
2. Check if there's an "Advanced" or "More Options" section
3. Try deleting the service and recreating it with Dockerfile from the start

## Alternative: Use Nixpacks Correctly

If you MUST use Nixpacks (Dockerfile not available), set these:

**For API:**
- **Root Directory**: EMPTY (project root)
- **Builder**: `NIXPACKS` (keep it)
- **Build Command**: `pnpm install && pnpm --filter api build`
  - **REMOVE** `cd ../.. &&` from the beginning
- **Start Command**: `cd apps/api && pnpm start`

**For Web:**
- **Root Directory**: EMPTY
- **Builder**: `NIXPACKS`
- **Build Command**: `pnpm install && pnpm --filter web build`
  - **REMOVE** `cd ../.. &&` from the beginning
- **Start Command**: `cd apps/web && pnpm preview`

## Visual Guide

The key is:
- ❌ **WRONG**: Root Directory = `apps/api` → Build Command = `cd ../.. && pnpm install...`
- ✅ **RIGHT**: Root Directory = `""` (empty) → Build Command = `pnpm install...` (no cd command)

## Verify Success

After fixing and redeploying, check build logs. You should see:
- ✅ "Installing pnpm" or "pnpm install" starting
- ✅ "Packages: +XXX" (dependencies installing)
- ✅ Build completing successfully
- ❌ NOT seeing "cd ../.." commands
- ❌ NOT seeing "No package.json found"

## Still Failing?

1. **Screenshot your Railway settings** and check:
   - Is Root Directory truly empty?
   - Is Build Command empty (if using Dockerfile)?
   - Is Builder set to DOCKERFILE?

2. **Try deleting and recreating the service:**
   - Delete the service
   - Add new service → GitHub Repo
   - Set Root Directory to EMPTY immediately
   - Set Builder to DOCKERFILE
   - Set Dockerfile Path

3. **Check Railway logs** for the exact error message



