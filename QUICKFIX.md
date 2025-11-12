# Quick Fix for Build Errors

## Problem 1: Cannot find module '@tailwindcss/postcss'

Build fails with error: `Cannot find module '@tailwindcss/postcss'`

This happens because the install script used `npm install --production` which skips devDependencies. However, `@tailwindcss/postcss` is needed to build the application.

## Problem 2: TypeScript Error - notebookId Type Mismatch

Build fails with: `Type 'string | undefined' is not assignable to type 'string'`

This happens because the Note type definition had `notebookId: string` (required) but the actual usage treats it as optional since notes can exist without a notebook.

## Immediate Fix (On Your Server)

Run these commands on your Ubuntu server:

```bash
cd ~/notemaster
git pull origin master
npm install
npm run build
pm2 restart notemaster
```

This will:
1. Pull the latest fixes from the repository
2. Install all dependencies including devDependencies
3. Build the application successfully with fixed types
4. Restart the application

## Permanent Fix

The install.sh and update.sh scripts have been updated to use `npm install` instead of `npm install --production`, and the Note type definition has been corrected to make `notebookId` optional.

If you need to reinstall or update:

```bash
cd ~/notemaster
git pull origin master
chmod +x install.sh update.sh
./update.sh
```

## Why These Happened

### Problem 1: Missing @tailwindcss/postcss
Next.js 15+ with Tailwind CSS v4 requires `@tailwindcss/postcss` at build time. This package is listed in devDependencies, but the original install script used `--production` flag which skips devDependencies.

### Problem 2: TypeScript Type Error
The Note interface in `src/types/note.ts` had `notebookId: string` (required), but the actual application logic treats it as optional since notes can exist independently without being assigned to a specific notebook. The type has been updated to `notebookId?: string` to match the actual usage.

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
