# Create pnpm-lock.yaml

The Railway deployment is failing because `pnpm-lock.yaml` is missing. This file is required for reproducible builds.

## Quick Fix

Run these commands in your project root:

```bash
# Install dependencies (this creates pnpm-lock.yaml)
pnpm install

# Commit the lockfile
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml for Railway deployment"
git push
```

After pushing, Railway will automatically redeploy and the build should succeed.

## Why This Is Needed

- `pnpm-lock.yaml` ensures all environments use the same dependency versions
- Railway uses `--frozen-lockfile` flag for reproducible builds
- Without it, builds can fail or produce inconsistent results

## Verify

After pushing, check that:
1. `pnpm-lock.yaml` exists in your repository root
2. It's committed to git (check with `git ls-files | grep pnpm-lock.yaml`)
3. Railway build logs show successful installation

## Alternative: Generate Lockfile Locally

If you want to test locally first:

```bash
# Clean install
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -f pnpm-lock.yaml

# Install fresh
pnpm install

# Verify lockfile was created
ls -la pnpm-lock.yaml

# Commit and push
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml"
git push
```



