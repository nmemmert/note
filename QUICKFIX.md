# Quick Fix for Build Error

## Problem
Build fails with error: `Cannot find module '@tailwindcss/postcss'`

This happens because the install script used `npm install --production` which skips devDependencies. However, `@tailwindcss/postcss` is needed to build the application.

## Immediate Fix (On Your Server)

Run these commands on your Ubuntu server:

```bash
cd ~/notemaster
npm install
npm run build
pm2 restart notemaster
```

This will:
1. Install all dependencies including devDependencies
2. Build the application successfully
3. Restart the application

## Permanent Fix

The install.sh and update.sh scripts have been updated to use `npm install` instead of `npm install --production`.

If you need to reinstall or update:

```bash
cd ~/notemaster
git pull origin master
chmod +x install.sh update.sh
./update.sh
```

## Why This Happened

Next.js 15+ with Tailwind CSS v4 requires `@tailwindcss/postcss` at build time. This package is listed in devDependencies, but the original install script used `--production` flag which skips devDependencies.

The fix ensures all dependencies are installed, allowing the build process to access the required Tailwind CSS PostCSS plugin.

## Verification

After running the fix, verify the application is working:

```bash
# Check if the app is running
pm2 status

# Check the logs
pm2 logs notemaster --lines 50

# Test the application
curl http://localhost:3000
```

You should see the application responding without errors.
