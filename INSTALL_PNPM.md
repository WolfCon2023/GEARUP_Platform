# Install pnpm on Windows

## Quick Install

### Option 1: Using npm (if you have Node.js installed)

```bash
npm install -g pnpm
```

### Option 2: Using PowerShell (Standalone)

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### Option 3: Using Corepack (Node.js 16.13+)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Verify Installation

After installing, verify it works:

```bash
pnpm --version
```

You should see a version number (e.g., `8.15.0`).

## Then Create Lockfile

Once pnpm is installed:

```bash
# Navigate to your project root (if not already there)
cd ~/Dropbox/Wolf\ Consulting\ Group/WCG/Development/GitHub/GEARUP_Platform

# Install dependencies (this creates pnpm-lock.yaml)
pnpm install

# Verify lockfile was created
ls pnpm-lock.yaml

# Commit it
git add pnpm-lock.yaml
git commit -m "Add pnpm-lock.yaml for Railway deployment"
git push
```

## Troubleshooting

### If npm is not found:
1. Install Node.js from https://nodejs.org/ (LTS version recommended)
2. Restart your terminal
3. Then run: `npm install -g pnpm`

### If you get permission errors:
- On Windows, you might need to run terminal as Administrator
- Or use a Node version manager like `nvm-windows`

### If pnpm command still not found after install:
- Close and reopen your terminal
- Or restart your computer
- Verify PATH includes Node.js bin directory



