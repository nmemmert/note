# NoteMaster - Update Guide

## 🔄 Quick Update

### One-Command Update:

```bash
cd ~/notemaster && chmod +x update.sh && ./update.sh
```

That's it! The update script handles everything automatically.

---

## 📋 What the Update Script Does

### Automatic Steps:

1. ✅ **Checks for updates** - Compares local vs remote version
2. ✅ **Creates backup** - Full backup before any changes
3. ✅ **Stops application** - Graceful shutdown
4. ✅ **Pulls latest code** - Gets new version from git
5. ✅ **Detects changes** - Smart dependency and schema detection
6. ✅ **Updates dependencies** - Only if package.json changed
7. ✅ **Migrates database** - Applies schema changes safely
8. ✅ **Rebuilds app** - Compiles new code
9. ✅ **Restarts app** - Starts updated version
10. ✅ **Verifies update** - Tests that app is working
11. ✅ **Auto-rollback** - Reverts if anything fails

### Safety Features:

- 🔒 **Zero data loss** - All data backed up first
- 🔄 **Automatic rollback** - Reverts on failure
- 📊 **Status checks** - Verifies each step
- 🎯 **Smart detection** - Only rebuilds what changed
- 💾 **Database backup** - PostgreSQL dump included
- 📝 **Detailed logging** - See exactly what's happening

---

## 📖 Update Process Walkthrough

### What You'll See:

```bash
$ ./update.sh

╔════════════════════════════════════════╗
║                                        ║
║     NoteMaster Update Script           ║
║                                        ║
╚════════════════════════════════════════╝

✔ Installation found at /home/user/notemaster
✔ Git repository detected
▶ Checking for updates...
⚠ Updates available!

Changes since your version:
a1b2c3d Add new feature: Dark mode
e4f5g6h Fix: Performance improvement
i7j8k9l Update dependencies

Continue with update? (y/N): y

▶ Creating backup before update...
✔ Backup created at /home/user/notemaster-backups/notemaster-backup-20250112_143022

▶ Stopping application...
✔ Application stopped

▶ Pulling latest changes...
✔ Code updated

▶ Checking for database schema changes...
✔ No schema changes detected

▶ Installing/updating dependencies...
✔ No dependency changes, skipping npm install

▶ Updating database schema...
✔ Prisma client regenerated

▶ Building application...
✔ Application built

▶ Starting application...
✔ Application started successfully

▶ Verifying update...
✔ Application is responding

▶ Cleaning up old backups (keeping last 5)...
✔ Old backups cleaned up

╔════════════════════════════════════════╗
║                                        ║
║     Update Complete! 🎉                ║
║                                        ║
╚════════════════════════════════════════╝

✔ NoteMaster has been updated!

Access your app at:
  http://localhost:3000
  http://192.168.1.100

Current version:
  a1b2c3d - Add new feature: Dark mode (2025-01-12)

Useful commands:
  View logs:        pm2 logs notemaster
  Check status:     pm2 status
  Restart app:      pm2 restart notemaster

Backup location:
  /home/user/notemaster-backups
```

---

## 🎯 Update Scenarios

### Scenario 1: Simple Code Update

**What changed:** Bug fixes, UI improvements, no dependencies or database changes

**Update time:** ~30 seconds

```
▶ Checking for updates... ✔
▶ Creating backup... ✔
▶ Pulling latest changes... ✔
▶ No dependency changes
▶ No schema changes
▶ Building application... ✔
▶ Restarting... ✔
```

### Scenario 2: New Dependencies

**What changed:** New npm packages added

**Update time:** ~2 minutes

```
▶ Pulling latest changes... ✔
▶ Dependencies changed, running npm install... ✔
▶ Building application... ✔
```

### Scenario 3: Database Schema Changes

**What changed:** Database models modified

**Update time:** ~3 minutes

```
▶ Pulling latest changes... ✔
▶ Database schema has changed ⚠
▶ Applying database migrations... ✔
▶ Building application... ✔
```

### Scenario 4: Major Update

**What changed:** Everything (code, dependencies, database)

**Update time:** ~5 minutes

```
▶ Pulling latest changes... ✔
▶ Dependencies changed, running npm install... ✔
▶ Database schema has changed ⚠
▶ Applying database migrations... ✔
▶ Building application... ✔
```

---

## 🚨 Failed Update Recovery

### Automatic Rollback

If update fails, the script automatically rolls back:

```
✖ Update failed!

✔ Rollback completed
⚠ Please verify the application is working correctly

Access at: http://localhost:3000
```

### Manual Rollback (if automatic fails)

```bash
# 1. Find your backup
ls -lt ~/notemaster-backups/ | head

# 2. Restore from backup
cd ~/notemaster
BACKUP=~/notemaster-backups/notemaster-backup-YYYYMMDD_HHMMSS
rsync -a --exclude '.git' $BACKUP/ ~/notemaster/

# 3. Restore database (if exists)
gunzip < $BACKUP/database.sql.gz | sudo -u postgres psql notemaster

# 4. Reinstall and restart
npm install --production
npm run build
pm2 restart notemaster

# 5. Verify
pm2 logs notemaster
```

---

## 📊 Checking Current Version

### View Current Version

```bash
cd ~/notemaster
git log -1 --oneline
```

### View Update History

```bash
cd ~/notemaster
git log --oneline --graph --decorate --all | head -20
```

### Check What Changed

```bash
cd ~/notemaster
git log --oneline --since="1 week ago"
```

### See Detailed Changes

```bash
cd ~/notemaster
git log -p --since="1 week ago"
```

---

## 🔍 Pre-Update Checks

### Before Updating (Optional)

1. **Check disk space**
```bash
df -h
# Make sure you have at least 2GB free
```

2. **Check app is running**
```bash
pm2 status notemaster
```

3. **Create manual backup**
```bash
~/notemaster/backup.sh
```

4. **Check for local changes**
```bash
cd ~/notemaster
git status
# Should show "nothing to commit, working tree clean"
```

---

## 🛠️ Update Options

### Check for Updates (Don't Install)

```bash
cd ~/notemaster
git fetch origin
git log HEAD..origin/main --oneline
```

### Force Reinstall (No New Code)

Useful if you suspect corruption:

```bash
cd ~/notemaster
./update.sh
# When asked "Already up to date! Force reinstall?"
# Answer: y
```

This will:
- Reinstall all dependencies
- Rebuild from scratch
- Restart application

### Skip Backup (Not Recommended)

Edit `update.sh` and comment out the backup step. **Not recommended for production!**

---

## 📅 Update Schedule Recommendations

### For Production Systems:

- **Check weekly** - Look for security updates
- **Update monthly** - Apply non-critical updates
- **Test first** - In dev environment if possible
- **Backup before** - Always (script does this automatically)
- **Monitor after** - Check logs for 24 hours

### For Development Systems:

- **Update frequently** - Get latest features
- **Don't worry about backups** - Development data is temporary

---

## 🔔 Automatic Update Notifications

### Set Up Email Notifications (Optional)

Create a script to check for updates and email you:

```bash
# Create checker script
cat > ~/check-notemaster-updates.sh <<'EOF'
#!/bin/bash
cd ~/notemaster
git fetch origin
if [ $(git rev-list HEAD..origin/main --count) -gt 0 ]; then
    echo "NoteMaster updates available!" | mail -s "NoteMaster Update Available" your@email.com
fi
EOF

chmod +x ~/check-notemaster-updates.sh

# Add to crontab (check daily at 9 AM)
(crontab -l 2>/dev/null; echo "0 9 * * * ~/check-notemaster-updates.sh") | crontab -
```

---

## 🧪 Testing Updates

### Test in Development First (Recommended)

If you have a test server:

```bash
# On test server
cd ~/notemaster
./update.sh

# Test all features
# - Login/logout
# - Create/edit/delete notes
# - Search functionality
# - All AI features
# - Upload files

# If everything works, update production
```

---

## 📋 Update Checklist

Before updating production:

- [ ] Create manual backup: `~/notemaster/backup.sh`
- [ ] Check disk space: `df -h`
- [ ] Note current version: `cd ~/notemaster && git log -1`
- [ ] Announce maintenance window (if public)
- [ ] Run update: `./update.sh`
- [ ] Verify application works
- [ ] Test login/authentication
- [ ] Test creating/editing notes
- [ ] Test search functionality
- [ ] Check all features work
- [ ] Monitor logs for 1 hour: `pm2 logs notemaster`
- [ ] Check error rate: Look for errors in logs
- [ ] Verify database connections
- [ ] Test from different devices
- [ ] Announce update complete

---

## 🐛 Troubleshooting Updates

### Update Won't Start

```bash
# Check if notemaster directory exists
ls -la ~/notemaster

# Check if it's a git repo
cd ~/notemaster && git status

# Check PM2 status
pm2 status
```

### "Already up to date" But Want to Rebuild

Answer "y" when asked to force reinstall, or:

```bash
cd ~/notemaster
pm2 stop notemaster
rm -rf node_modules .next
npm install --production
npm run build
pm2 restart notemaster
```

### Dependencies Won't Install

```bash
cd ~/notemaster
rm -rf node_modules package-lock.json
npm install --production
```

### Database Migration Fails

```bash
cd ~/notemaster

# Check database is running
sudo systemctl status postgresql

# Try db push instead of migrate
npx prisma db push

# If that fails, check Prisma logs
npx prisma migrate status
```

### Build Fails

```bash
cd ~/notemaster

# Clear Next.js cache
rm -rf .next

# Try building again
npm run build

# If still fails, check Node version
node -v  # Should be v20+
```

### App Won't Start After Update

```bash
# Check logs
pm2 logs notemaster --lines 100

# Check if port is available
lsof -i :3000

# Try manual start
cd ~/notemaster
npm start

# If error, check .env file
cat ~/notemaster/.env
```

---

## 💡 Advanced Update Options

### Update from Specific Branch

```bash
cd ~/notemaster
git checkout develop  # or feature branch
./update.sh
```

### Update to Specific Version

```bash
cd ~/notemaster
git checkout v1.2.3  # or specific commit
./update.sh
```

### Preview Changes Before Updating

```bash
cd ~/notemaster
git fetch origin
git diff HEAD..origin/main
```

---

## 📞 Getting Help

If update fails:

1. **Check logs**: `pm2 logs notemaster --lines 100`
2. **Check update output**: Scroll up to see error message
3. **Try rollback**: Script does this automatically
4. **Manual restore**: Use backup from `~/notemaster-backups/`
5. **Fresh install**: Last resort, reinstall from scratch

---

## 🎓 Update Best Practices

1. ✅ **Always backup first** (script does this)
2. ✅ **Read release notes** before updating
3. ✅ **Test in dev environment** if possible
4. ✅ **Update during low-traffic times**
5. ✅ **Monitor after update** for 24 hours
6. ✅ **Keep old backups** for 30 days
7. ✅ **Document any issues** encountered
8. ✅ **Update regularly** - Don't wait too long

## ❌ What NOT to Do

1. ❌ Don't delete backups immediately
2. ❌ Don't update during peak hours
3. ❌ Don't skip reading release notes
4. ❌ Don't panic if something fails (script has rollback)
5. ❌ Don't manually edit files during update
6. ❌ Don't kill the update process midway

---

**Happy Updating!** 🎉

The update script makes keeping NoteMaster current safe and easy.
