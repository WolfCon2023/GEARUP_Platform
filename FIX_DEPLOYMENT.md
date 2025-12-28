# Fix Railway Deployment - Missing pnpm-lock.yaml

## The Problem
Railway build fails because `pnpm-lock.yaml` is missing. The Dockerfiles are trying to use `--frozen-lockfile` but the lock file doesn't exist.

## Quick Fix (Choose One)

### Option 1: Create Lockfile (Recommended)

This ensures reproducible builds:

```bash
# In your project root directory
pnpm install

# This creates pnpm-lock.yaml - commit it
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml for Railway deployment"
git push
```

After pushing, Railway will automatically redeploy and should succeed.

### Option 2: Use Updated Dockerfiles (Temporary Fix)

I've updated the Dockerfiles to work without the lockfile. They will:
- Check if `pnpm-lock.yaml` exists
- Use `--frozen-lockfile` if it exists
- Use regular `pnpm install` if it doesn't

**Steps:**
1. Commit the updated Dockerfiles:
   ```bash
   git add apps/api/Dockerfile apps/web/Dockerfile
   git commit -m "Update Dockerfiles to handle missing pnpm-lock.yaml"
   git push
   ```

2. Railway will redeploy automatically

**Note:** Option 1 is better long-term for reproducible builds.

## Verify Fix

After pushing changes:

1. Go to Railway dashboard
2. Check the **Deployments** tab
3. View logs - should see successful `pnpm install`
4. Build should complete without errors

## Why pnpm-lock.yaml is Important

- Ensures all environments (dev, staging, production) use the same dependency versions
- Prevents "works on my machine" issues
- Required for CI/CD best practices
- Railway uses `--frozen-lockfile` by default for security

## Next Steps

1. ✅ Create `pnpm-lock.yaml` (Option 1) - **Do this now**
2. ✅ Commit and push
3. ✅ Wait for Railway to redeploy
4. ✅ Verify deployment succeeds

## Still Having Issues?

If build still fails after creating the lockfile:

1. Check Railway logs for specific errors
2. Verify `pnpm-lock.yaml` is in the repository root (not in a subdirectory)
3. Make sure it's committed: `git ls-files | grep pnpm-lock.yaml`
4. Try redeploying manually in Railway dashboard



