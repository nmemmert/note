# NoteMaster - One-Command Installation Guide

## 🚀 Quick Install (Ubuntu/Debian)

### One-Line Installation:

```bash
chmod +x install.sh && ./install.sh
```

That's it! The script will automatically:

✅ Check and find available ports (changes port if 3000 is in use)
✅ Install Node.js 20
✅ Install and configure PostgreSQL
✅ Create secure database with random password
✅ Install PM2 process manager
✅ Install and configure Nginx reverse proxy
✅ Set up the application
✅ Run database migrations
✅ Build the production app
✅ Start the application
✅ Configure firewall (optional)
✅ Create backup script

---

## 📋 Requirements

- **OS**: Ubuntu 20.04+ or Debian 11+ (also works on Ubuntu-based distros)
- **User**: Non-root user with sudo privileges
- **Internet**: Active internet connection
- **Disk Space**: ~2GB free space

---

## 🎯 What the Script Does

### Port Detection
- Checks if port 3000 is available
- If in use, automatically finds next available port
- Updates configuration to use the available port

### Security
- Generates random secure database password
- Generates random NextAuth secret
- Sets up firewall rules (optional)
- Runs as non-root user (uses sudo only when needed)

### Components Installed
1. **Node.js 20** - JavaScript runtime
2. **PostgreSQL** - Database
3. **PM2** - Process manager (keeps app running)
4. **Nginx** - Reverse proxy and web server
5. **NoteMaster** - Your note-taking app

---

## 📝 Usage Instructions

### 1. Download the repository

```bash
git clone https://github.com/yourusername/notemaster.git
cd notemaster
```

### 2. Make the script executable

```bash
chmod +x install.sh
```

### 3. Run the installer

```bash
./install.sh
```

The script will:
- Ask for sudo password when needed
- Show progress with colored output
- Check if ports are available
- Automatically handle conflicts
- Display final access URL when done

### 4. Access your app

After installation completes, access at:
- **Local**: `http://localhost:3000`
- **Network**: `http://YOUR_SERVER_IP` (shown in output)

---

## 🔧 Post-Installation Commands

### View Application Logs
```bash
pm2 logs notemaster
```

### Check Application Status
```bash
pm2 status
```

### Restart Application
```bash
pm2 restart notemaster
```

### Stop Application
```bash
pm2 stop notemaster
```

### Start Application
```bash
pm2 start notemaster
```

### View Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 💾 Backup & Restore

### Create Manual Backup

The installer creates a backup script at `~/notemaster/backup.sh`

```bash
~/notemaster/backup.sh
```

Backups are saved to `~/notemaster-backups/`

### Setup Automatic Daily Backups

```bash
# Add cron job for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * $HOME/notemaster/backup.sh") | crontab -
```

### Restore from Backup

```bash
# Restore database
gunzip < ~/notemaster-backups/notemaster_db_YYYYMMDD_HHMMSS.sql.gz | sudo -u postgres psql notemaster

# Restore uploads
tar -xzf ~/notemaster-backups/notemaster_uploads_YYYYMMDD_HHMMSS.tar.gz -C ~/notemaster/public/
```

---

## 🔒 SSL Certificate Setup (HTTPS)

### If You Have a Domain Name:

1. **Point your domain to your server's IP**

2. **Install certificate with Certbot**:
```bash
sudo certbot --nginx -d yourdomain.com
```

3. **Auto-renewal is configured automatically**

Certbot will:
- Get a free SSL certificate from Let's Encrypt
- Configure Nginx for HTTPS
- Set up automatic renewal

---

## 🐛 Troubleshooting

### Port Already in Use

The script automatically detects and uses an available port. Check the installation output for the actual port used.

### Can't Access from Other Devices

1. Check firewall:
```bash
sudo ufw status
sudo ufw allow 80/tcp
```

2. Check if Nginx is running:
```bash
sudo systemctl status nginx
```

3. Check app is running:
```bash
pm2 status
```

### Database Connection Error

1. Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

3. Check database credentials in `~/notemaster/.env`

### Application Won't Start

1. View detailed logs:
```bash
pm2 logs notemaster --lines 100
```

2. Check Node.js version:
```bash
node -v  # Should be v20.x
```

3. Rebuild application:
```bash
cd ~/notemaster
npm run build
pm2 restart notemaster
```

### Nginx Configuration Error

1. Test Nginx config:
```bash
sudo nginx -t
```

2. Reload Nginx:
```bash
sudo systemctl reload nginx
```

---

## 🔄 Updating the Application

### Automatic Update (Recommended)

Use the included update script that handles everything safely:

```bash
cd ~/notemaster
chmod +x update.sh
./update.sh
```

The update script will:
- ✅ Check for available updates
- ✅ Create automatic backup before updating
- ✅ Pull latest changes from git
- ✅ Install new dependencies
- ✅ Run database migrations
- ✅ Rebuild the application
- ✅ Restart with zero downtime
- ✅ Verify the update succeeded
- ✅ Automatic rollback if anything fails

### Manual Update (Advanced)

If you prefer manual control:

```bash
cd ~/notemaster

# Stop app
pm2 stop notemaster

# Backup current version
cp -r ~/notemaster ~/notemaster-backup-$(date +%Y%m%d)

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart notemaster
```

---

## 🗑️ Uninstallation

### Remove NoteMaster

```bash
# Stop and remove from PM2
pm2 delete notemaster
pm2 save

# Remove application
rm -rf ~/notemaster

# Remove Nginx config
sudo rm /etc/nginx/sites-enabled/notemaster
sudo rm /etc/nginx/sites-available/notemaster
sudo systemctl reload nginx

# Remove database (optional)
sudo -u postgres psql -c "DROP DATABASE notemaster;"
sudo -u postgres psql -c "DROP USER notemaster;"
```

### Remove All Components (Complete Uninstall)

```bash
# Remove Node.js
sudo apt remove nodejs -y

# Remove PostgreSQL
sudo apt remove postgresql postgresql-contrib -y

# Remove Nginx
sudo apt remove nginx -y

# Remove PM2
sudo npm uninstall -g pm2
```

---

## 📊 System Requirements

### Minimum:
- **CPU**: 1 core
- **RAM**: 2GB
- **Storage**: 10GB
- **OS**: Ubuntu 20.04+

### Recommended:
- **CPU**: 2+ cores
- **RAM**: 4GB+
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 22.04 LTS

### Tested On:
- ✅ Ubuntu 20.04 LTS
- ✅ Ubuntu 22.04 LTS
- ✅ Ubuntu 24.04 LTS
- ✅ Debian 11
- ✅ Debian 12

---

## 🌐 Network Configuration

### Access from LAN

The app is automatically accessible from your local network at:
```
http://YOUR_SERVER_IP
```

Find your server IP with:
```bash
hostname -I
```

### Access from Internet

To access from outside your network:

1. **Configure port forwarding** on your router:
   - Forward port 80 to your server's local IP
   - Forward port 443 (if using HTTPS)

2. **Use Dynamic DNS** (if you don't have static IP):
   - DuckDNS (free)
   - No-IP (free)
   - Cloudflare (free with domain)

3. **Set up SSL certificate** (recommended for internet access):
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🎓 What Gets Installed Where

```
~/notemaster/                    # Main application directory
├── .env                         # Environment configuration
├── backup.sh                    # Backup script
├── public/uploads/              # User uploaded files
└── [app files]

~/notemaster-backups/            # Backup directory
├── notemaster_db_*.sql.gz       # Database backups
└── notemaster_uploads_*.tar.gz  # Upload backups

/etc/nginx/sites-available/      # Nginx configuration
└── notemaster

/var/lib/postgresql/             # PostgreSQL data directory

~/.pm2/                          # PM2 process manager data
```

---

## 💡 Tips

1. **Regular Backups**: Set up automatic daily backups
2. **Monitor Logs**: Check `pm2 logs` regularly
3. **Update System**: Keep Ubuntu updated with `sudo apt update && sudo apt upgrade`
4. **Use HTTPS**: Set up SSL certificate if accessible from internet
5. **Firewall**: Keep firewall enabled for security
6. **Static IP**: Use static IP for your server (in router settings)

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. View logs: `pm2 logs notemaster`
3. Check system logs: `journalctl -xe`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## 🎉 You're Done!

NoteMaster is now running on your server!

Create your first account and start taking notes! 📝
