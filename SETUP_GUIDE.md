# Complete Setup Guide: GitHub → Railway

This guide walks you through setting up GitHub and deploying to Railway.

## Part 1: GitHub Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `GEARUP_Platform` (or your preferred name)
3. Description: "North Star Student Success OS - Role-based student success platform"
4. Choose **Private** or **Public** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

### Step 2: Initialize Git in Your Project

Open your terminal in the project root directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: North Star Student Success OS"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/GEARUP_Platform.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/GEARUP_Platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify GitHub Setup

1. Go to your repository on GitHub
2. Verify all files are uploaded
3. Check that `.gitignore` is working (node_modules should NOT be visible)

### Step 4: Create .env Files (DO NOT COMMIT THESE)

Create these files locally but **DO NOT commit them** (they're in .gitignore):

**`apps/api/.env`** (create this file):
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/northstar
JWT_SECRET=change-this-to-a-random-secret-key-in-production
```

**`apps/web/.env`** (create this file):
```env
VITE_API_URL=http://localhost:3001/api
```

### Step 5: Test Locally First (Optional but Recommended)

```bash
# Install dependencies
pnpm install

# Seed database (requires MongoDB running locally)
pnpm seed

# Start development servers
pnpm dev
```

Visit http://localhost:3000 and test login with:
- Email: `director@northstar.edu`
- Password: `director123`

---

## Part 2: Railway Setup

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **Login** → **GitHub**
3. Authorize Railway to access your GitHub account

### Step 2: Create New Project

1. In Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Find and select your `GEARUP_Platform` repository
4. Click **Deploy Now**

### Step 3: Add MongoDB Service

1. In your Railway project, click **+ New**
2. Select **Database** → **MongoDB**
3. Railway will automatically provision a MongoDB instance
4. Click on the MongoDB service
5. Go to **Variables** tab
6. Copy the `MONGO_URL` value (you'll need this for the API service)

### Step 4: Deploy Backend API

1. In your Railway project, click **+ New**
2. Select **GitHub Repo** → choose your repository again
3. Railway will detect it's a monorepo
4. In the service settings:
   - **Root Directory**: Set to `apps/api`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm start`

5. Go to **Variables** tab and add:
   ```
   MONGODB_URI = <paste the MONGO_URL from MongoDB service>
   JWT_SECRET = <generate a secure random string, e.g., use: openssl rand -hex 32>
   PORT = 3001
   ```

6. Railway will automatically:
   - Install dependencies
   - Build the project
   - Start the server

7. Wait for deployment to complete (check **Deployments** tab)

8. Once deployed, click on the service → **Settings** → **Generate Domain**
   - Copy this domain (e.g., `your-api.railway.app`)
   - You'll need this for the frontend

### Step 5: Seed the Database

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed script
railway run --service api pnpm seed
```

**Option B: Using Railway Dashboard**
1. Go to your API service
2. Click **Settings** → **Connect via SSH** (if available)
3. Or use the **Shell** feature in Railway dashboard
4. Run: `pnpm seed`

### Step 6: Deploy Frontend

1. In your Railway project, click **+ New**
2. Select **GitHub Repo** → choose your repository
3. In service settings:
   - **Root Directory**: Set to `apps/web`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `pnpm preview` (or use a static file server)

4. Go to **Variables** tab and add:
   ```
   VITE_API_URL = https://your-api.railway.app/api
   ```
   (Replace `your-api.railway.app` with your actual API domain from Step 4)

5. Railway will build and deploy the frontend

6. Once deployed, click on the service → **Settings** → **Generate Domain**
   - This is your frontend URL

### Step 7: Update CORS (If Needed)

If you get CORS errors, update `apps/api/src/index.ts`:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

Add to API service variables:
```
FRONTEND_URL = https://your-frontend.railway.app
```

### Step 8: Verify Deployment

1. Visit your frontend URL
2. Try logging in with test accounts:
   - `director@northstar.edu` / `director123`
3. Test navigation and features

---

## Part 3: Custom Domains (Optional)

### For Backend API

1. Go to API service → **Settings** → **Domains**
2. Click **Custom Domain**
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Railway provides DNS records to add to your domain provider
5. Update `VITE_API_URL` in frontend variables to use new domain

### For Frontend

1. Go to Frontend service → **Settings** → **Domains**
2. Click **Custom Domain**
3. Enter your domain (e.g., `app.yourdomain.com`)
4. Add DNS records provided by Railway

---

## Troubleshooting

### Build Fails

**Issue**: Build command fails
- Check Railway logs for specific errors
- Verify Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`

**Solution**: Railway uses Nixpacks which auto-detects Node.js. If issues persist:
- Add `nixpacks.toml` in root:
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "pnpm"]
```

### MongoDB Connection Fails

**Issue**: API can't connect to MongoDB
- Verify `MONGODB_URI` is correct
- Check MongoDB service is running in Railway
- Ensure variable name is exactly `MONGODB_URI` (case-sensitive)

### Frontend Can't Reach API

**Issue**: CORS errors or API calls fail
- Verify `VITE_API_URL` is correct
- Check API service is running
- Update CORS settings in backend
- Check Railway logs for errors

### Environment Variables Not Working

**Issue**: Variables not being read
- Frontend: Must start with `VITE_` prefix (already done)
- Backend: Restart service after adding variables
- Verify variable names match exactly (case-sensitive)

### Seed Script Fails

**Issue**: Can't seed database
- Ensure MongoDB service is running
- Verify `MONGODB_URI` is set correctly
- Check Railway logs for connection errors
- Try running seed locally first to verify it works

---

## Quick Reference: Railway Service Configuration

### Backend API Service
- **Root Directory**: `apps/api`
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Variables**:
  - `MONGODB_URI` (from MongoDB service)
  - `JWT_SECRET` (random secure string)
  - `PORT` (optional, defaults to 3001)

### Frontend Service
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm preview` or use static hosting
- **Variables**:
  - `VITE_API_URL` (your API domain + `/api`)

---

## Next Steps After Deployment

1. ✅ Test all user roles and features
2. ✅ Set up monitoring/alerts in Railway
3. ✅ Configure backups for MongoDB
4. ✅ Set up custom domains (if needed)
5. ✅ Review and update security settings
6. ✅ Set up CI/CD for automatic deployments

---

## Support

If you encounter issues:
1. Check Railway logs (Deployments → View Logs)
2. Verify all environment variables are set
3. Test locally first to isolate issues
4. Check Railway status page: https://status.railway.app

