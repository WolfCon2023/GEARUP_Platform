# Railway Dockerfile Setup Guide

## Project Structure
This is a **pnpm workspaces monorepo** with:
- Root: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- Shared package: `packages/shared/`
- API service: `apps/api/`
- Web service: `apps/web/`

## Dockerfiles Created
✅ `apps/api/Dockerfile` - For API service
✅ `apps/web/Dockerfile` - For Web service
✅ `.dockerignore` - Excludes unnecessary files

## Railway Configuration

### For API Service

1. **Go to Railway Dashboard** → Your Project → API Service
2. **Settings** → **Build & Deploy**:
   - **Root Directory**: Leave **COMPLETELY EMPTY** (this is critical!)
     - This makes Railway use the project root as build context
     - The Dockerfile expects to be run from project root
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `apps/api/Dockerfile`
   - **Build Command**: Leave **EMPTY** (Dockerfile handles everything)
   - **Start Command**: Leave **EMPTY** (Dockerfile CMD handles it)
3. **Variables** tab:
   - `MONGODB_URI` = (your MongoDB connection string)
   - `JWT_SECRET` = (your JWT secret)
   - `PORT` = `3001` (optional, defaults to 3001)
4. **Save**

### For Web Service

1. **Go to Railway Dashboard** → Your Project → Web Service
2. **Settings** → **Build & Deploy**:
   - **Root Directory**: Leave **COMPLETELY EMPTY**
   - **Builder**: `DOCKERFILE`
   - **Dockerfile Path**: `apps/web/Dockerfile`
   - **Build Command**: Leave **EMPTY**
   - **Start Command**: Leave **EMPTY**
3. **Variables** tab:
   - `VITE_API_URL` = `https://your-api-service.railway.app/api`
   - `PORT` = `3000` (optional)
4. **Save**

## How the Dockerfiles Work

1. **Base Image**: Uses `node:18-alpine` (lightweight)
2. **Install pnpm**: Installs pnpm globally
3. **Copy Files**: 
   - Root package files (package.json, pnpm-workspace.yaml, pnpm-lock.yaml)
   - Shared package (needed by both apps)
   - The specific app (api or web)
4. **Install Dependencies**: Runs `pnpm install --frozen-lockfile` from root
   - This installs all workspace dependencies correctly
5. **Build**: 
   - First builds shared package (if it has build script)
   - Then builds the app
6. **Run**: Starts the service

## Key Points

- ✅ **No `cd ../..` commands** - Everything works from project root
- ✅ **Uses pnpm** - Matches your project setup
- ✅ **Handles workspaces** - Installs all dependencies correctly
- ✅ **Builds in order** - Shared package → App
- ✅ **Root Directory = EMPTY** - Critical for correct build context

## Troubleshooting

### If build fails with "No package.json found"

**Problem**: Root Directory is not empty
**Solution**: 
1. Go to Railway settings
2. Click Root Directory field
3. Select all text (Ctrl+A) and delete
4. Leave it completely empty
5. Save and redeploy

### If build fails with "pnpm: command not found"

**Problem**: Railway might be using Nixpacks instead of Dockerfile
**Solution**:
1. Verify Builder is set to `DOCKERFILE` (not NIXPACKS)
2. Verify Dockerfile Path is correct
3. Save and redeploy

### If dependencies fail to install

**Problem**: pnpm-lock.yaml might be missing or outdated
**Solution**:
1. Run `pnpm install` locally
2. Commit `pnpm-lock.yaml`
3. Push to GitHub
4. Redeploy on Railway

## Verify Success

After deploying, check Railway build logs. You should see:
- ✅ "Installing pnpm"
- ✅ "pnpm install --frozen-lockfile" running
- ✅ "Packages: +XXX" (dependencies installing)
- ✅ "Building shared package" (or "No build script")
- ✅ "Building API/Web app"
- ✅ Build completes successfully
- ✅ Service starts

## Next Steps

1. ✅ Configure Railway settings as above
2. ✅ Set environment variables
3. ✅ Redeploy services
4. ✅ Verify both services are running
5. ✅ Test the application

