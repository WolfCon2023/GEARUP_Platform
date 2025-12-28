# FINAL Railway Solution - Step by Step

## The Real Problem
Railway is using Nixpacks and adding `cd ../..` to build commands automatically. We need to prevent this.

## The Solution: Correct Railway Settings

### CRITICAL: Root Directory Must Be Empty

The Root Directory field in Railway MUST be completely empty. If it has ANY value (even a space), Railway uses that as build context and adds `cd ../..` commands.

### Step-by-Step Instructions

#### 1. Delete Existing Services
- Go to Railway Dashboard
- Delete API service
- Delete Web service
- Start fresh

#### 2. Create API Service

**Click "+ New" → "GitHub Repo" → Select GEARUP_Platform**

**Go to Settings → Build & Deploy:**

1. **Root Directory**: 
   - Click the field
   - DELETE everything in it
   - Make sure it's COMPLETELY EMPTY (not even a space)
   - This is the most important step!

2. **Builder**: 
   - Should say `NIXPACKS` (that's fine, we'll use it correctly)

3. **Build Command**: 
   - Type exactly: `npm install -g pnpm && pnpm install && pnpm --filter api build`
   - DO NOT include `cd ../..` - we're already at root!

4. **Start Command**: 
   - Type exactly: `cd apps/api && pnpm start`

5. **Click "Save"**

**Go to Variables tab, add:**
- `MONGODB_URI` = (your MongoDB connection string)
- `JWT_SECRET` = (generate with: `openssl rand -hex 32`)
- `PORT` = `3001`

#### 3. Create Web Service

**Click "+ New" → "GitHub Repo" → Select GEARUP_Platform (same repo)**

**Go to Settings → Build & Deploy:**

1. **Root Directory**: EMPTY (delete everything)

2. **Builder**: `NIXPACKS`

3. **Build Command**: 
   - Type exactly: `npm install -g pnpm && pnpm install && pnpm --filter web build`

4. **Start Command**: 
   - Type exactly: `cd apps/web && pnpm preview`

5. **Click "Save"**

**Go to Variables tab, add:**
- `VITE_API_URL` = `https://your-api-service.railway.app/api`
- `PORT` = `3000`

## Why This Will Work

- Root Directory = empty → Railway uses project root
- Build command runs from root → finds `package.json` and `pnpm-lock.yaml`
- No `cd ../..` → no navigation issues
- Simple, direct commands → Railway can't mess them up

## Troubleshooting

If it still fails:

1. **Double-check Root Directory is empty:**
   - Click the field
   - Select all text (Ctrl+A)
   - Delete
   - Click outside to save

2. **Check build logs:**
   - Should see "Installing pnpm" first
   - Then "pnpm install" from root
   - Should NOT see "cd ../.."

3. **Try manual redeploy:**
   - Deployments tab → Redeploy

## Alternative: If Nixpacks Still Fails

If Nixpacks keeps adding `cd ../..`, we can:

1. **Use Railway's Node.js buildpack directly**
2. **Deploy pre-built artifacts**
3. **Use a different platform** (Vercel for frontend, Railway for API only)

Let me know if you want to try one of these alternatives.



