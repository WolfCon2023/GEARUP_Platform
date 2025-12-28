# Railway Fix - NO Dockerfile Approach

## The Problem
Railway keeps using Nixpacks auto-generated Dockerfile and ignoring our custom one. Let's bypass Dockerfile completely.

## Solution: Use Railway's Native Build System

### Step 1: Delete Current Services
1. Go to Railway Dashboard
2. Delete both API and Web services
3. We'll recreate them with correct settings

### Step 2: Create API Service (NO Dockerfile)

1. Click **+ New** → **GitHub Repo** → Select your repo
2. **Settings** → **Build & Deploy**:
   - **Root Directory**: Leave **COMPLETELY EMPTY** (this is critical!)
   - **Builder**: `NIXPACKS` (we'll use it correctly this time)
   - **Build Command**: `npm install -g pnpm && pnpm install && pnpm --filter api build`
     - **NO `cd ../..` - we're already at root!**
   - **Start Command**: `cd apps/api && pnpm start`
3. **Variables** tab, add:
   - `MONGODB_URI=<your-mongodb-uri>`
   - `JWT_SECRET=<your-secret>`
   - `PORT=3001`
4. **Save**

### Step 3: Create Web Service (NO Dockerfile)

1. Click **+ New** → **GitHub Repo** → Select your repo (same repo)
2. **Settings** → **Build & Deploy**:
   - **Root Directory**: Leave **COMPLETELY EMPTY**
   - **Builder**: `NIXPACKS`
   - **Build Command**: `npm install -g pnpm && pnpm install && pnpm --filter web build`
     - **NO `cd ../..`**
   - **Start Command**: `cd apps/web && pnpm preview`
3. **Variables** tab, add:
   - `VITE_API_URL=https://your-api-service.railway.app/api`
   - `PORT=3000`
4. **Save**

## Key Points

1. **Root Directory MUST be empty** - this makes Railway use project root
2. **Build Command starts from root** - no `cd ../..` needed
3. **Start Command navigates to app directory** - `cd apps/api` or `cd apps/web`

## Why This Works

- Railway uses project root as build context (Root Directory = empty)
- Build command runs from root, so `pnpm install` finds `package.json`
- No Dockerfile complexity
- No build context issues

## Verify

After deploying, check logs. You should see:
- ✅ "Installing pnpm"
- ✅ "pnpm install" running from root
- ✅ "Packages: +XXX" installing
- ✅ Build completing successfully



