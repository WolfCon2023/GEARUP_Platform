# Last Resort Railway Fix

## The Real Issue
Railway's Nixpacks is auto-detecting the monorepo and adding `cd ../..` commands. We need to prevent this.

## Solution: Use Root-Level nixpacks.toml

I've created a `nixpacks.toml` at the project root that Railway will use. This tells Railway exactly what to do without it trying to be "smart".

### Step 1: Delete Services and Recreate

1. Delete both API and Web services in Railway
2. Recreate them with these EXACT settings

### Step 2: Create API Service

1. **+ New** → **GitHub Repo** → Select GEARUP_Platform
2. **Settings** → **Build & Deploy**:
   - **Root Directory**: Leave **COMPLETELY EMPTY** (this is critical!)
   - **Builder**: `NIXPACKS` (it will use our nixpacks.toml)
   - **Build Command**: Leave **EMPTY** (nixpacks.toml handles it)
   - **Start Command**: Leave **EMPTY** (nixpacks.toml handles it)
3. **Variables** tab, add:
   - `APP=api` (this tells nixpacks.toml which app to build)
   - `MONGODB_URI=<your-mongodb-uri>`
   - `JWT_SECRET=<your-secret>`
   - `PORT=3001`
4. **Save**

### Step 3: Create Web Service

1. **+ New** → **GitHub Repo** → Select GEARUP_Platform (same repo)
2. **Settings** → **Build & Deploy**:
   - **Root Directory**: **EMPTY**
   - **Builder**: `NIXPACKS`
   - **Build Command**: **EMPTY**
   - **Start Command**: **EMPTY**
3. **Variables** tab, add:
   - `APP=web` (this tells nixpacks.toml which app to build)
   - `VITE_API_URL=https://your-api.railway.app/api`
   - `PORT=3000`
4. **Save**

## How It Works

- `nixpacks.toml` at root tells Railway exactly what to do
- No `cd ../..` commands - everything runs from root
- `APP` environment variable determines which app to build/run
- Railway can't "auto-detect" and mess things up

## If This Still Doesn't Work

Railway might be ignoring nixpacks.toml. In that case:

### Alternative: Use Different Platforms

1. **Frontend (Web)**: Deploy to **Vercel** (excellent for React/Vite)
   - Connect GitHub repo
   - Root Directory: `apps/web`
   - Build Command: `pnpm install && pnpm build`
   - Output Directory: `dist`
   - Framework: Vite

2. **Backend (API)**: Keep on Railway
   - Use the same approach but just for API
   - Or use **Render.com** or **Fly.io**

### Or: Pre-build Locally

1. Build locally: `pnpm build`
2. Commit `dist` folders
3. Deploy static files

Let me know if you want to try Vercel for the frontend - it's much simpler for React apps.

