# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed (`npm install -g pnpm`)
- [ ] GitHub account
- [ ] Railway account (free tier works)

## 5-Minute Setup

### 1. GitHub Setup (2 minutes)

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Railway Setup (3 minutes)

1. **Login to Railway**: https://railway.app → Login with GitHub

2. **Create Project**: New Project → Deploy from GitHub → Select your repo

3. **Add MongoDB**: + New → Database → MongoDB → Copy `MONGO_URL`

4. **Deploy API**:
   - + New → GitHub Repo → Your repo
   - Settings → Root Directory: `apps/api`
   - Variables:
     - `MONGODB_URI` = (paste MONGO_URL)
     - `JWT_SECRET` = (generate: `openssl rand -hex 32`)

5. **Deploy Frontend**:
   - + New → GitHub Repo → Your repo
   - Settings → Root Directory: `apps/web`
   - Variables:
     - `VITE_API_URL` = `https://your-api.railway.app/api`

6. **Seed Database**:
   ```bash
   railway run --service api pnpm seed
   ```

7. **Done!** Visit your frontend URL and login with:
   - `director@northstar.edu` / `director123`

## Common Commands

```bash
# Local development
pnpm install          # Install dependencies
pnpm seed             # Seed database
pnpm dev              # Start dev servers

# Railway CLI
railway login         # Login to Railway
railway link          # Link to project
railway run pnpm seed # Run command in Railway
railway logs          # View logs
```

## Need Help?

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.

