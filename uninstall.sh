#!/bin/bash

#############################################
# NoteMaster - Uninstall Script
# Safely removes NoteMaster from your system
#############################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="NoteMaster"
APP_DIR="$HOME/notemaster"
BACKUP_DIR="$HOME/notemaster-backups"
NGINX_CONF="/etc/nginx/sites-available/notemaster"
NGINX_ENABLED="/etc/nginx/sites-enabled/notemaster"

#############################################
# Utility Functions
#############################################

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}║     NoteMaster Uninstall Script        ║${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}▶ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✖ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✔ $1${NC}"
}

confirm_action() {
    local message=$1
    echo -e "${YELLOW}$message${NC}"
    read -p "Are you sure? (yes/NO): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Uninstall cancelled"
        exit 0
    fi
}

#############################################
# Pre-flight Checks
#############################################

check_installation() {
    if [[ ! -d "$APP_DIR" ]]; then
        print_error "NoteMaster is not installed at $APP_DIR"
        exit 1
    fi
    
    print_success "Found NoteMaster installation at $APP_DIR"
}

#############################################
# Uninstall Functions
#############################################

stop_application() {
    print_step "Stopping application..."
    
    # Stop PM2 process
    if command -v pm2 &> /dev/null; then
        pm2 stop notemaster 2>/dev/null || true
        pm2 delete notemaster 2>/dev/null || true
        pm2 save --force 2>/dev/null || true
    fi
    
    print_success "Application stopped"
}

backup_data() {
    print_step "Creating final backup of your data..."
    
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_PATH="$BACKUP_DIR/notemaster-final-backup-$(date +%Y%m%d_%H%M%S)"
    
    # Backup application directory
    rsync -a --exclude 'node_modules' --exclude '.next' --exclude '.git' "$APP_DIR/" "$BACKUP_PATH/"
    
    # Backup database
    if command -v pg_dump &> /dev/null; then
        sudo -u postgres pg_dump notemaster 2>/dev/null | gzip > "$BACKUP_PATH/database.sql.gz" || {
            print_warning "Could not backup PostgreSQL database"
        }
    fi
    
    # Copy SQLite database if exists
    if [[ -f "$APP_DIR/prisma/dev.db" ]]; then
        cp "$APP_DIR/prisma/dev.db" "$BACKUP_PATH/"
        print_success "SQLite database backed up"
    fi
    
    print_success "Backup created at $BACKUP_PATH"
}

remove_nginx_config() {
    print_step "Removing Nginx configuration..."
    
    if [[ -f "$NGINX_ENABLED" ]]; then
        sudo rm -f "$NGINX_ENABLED"
        print_success "Removed Nginx symlink"
    fi
    
    if [[ -f "$NGINX_CONF" ]]; then
        sudo rm -f "$NGINX_CONF"
        print_success "Removed Nginx config"
    fi
    
    # Test and reload Nginx if it's running
    if systemctl is-active --quiet nginx; then
        sudo nginx -t && sudo systemctl reload nginx
        print_success "Nginx reloaded"
    fi
}

remove_application() {
    print_step "Removing application files..."
    
    cd "$HOME"
    rm -rf "$APP_DIR"
    
    print_success "Application files removed"
}

remove_database() {
    print_step "Handling database removal..."
    
    echo "Would you like to remove the PostgreSQL database?"
    echo "(This will permanently delete all your notes and data)"
    read -p "Remove database? (yes/NO): " -r
    echo
    
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        if command -v psql &> /dev/null; then
            sudo -u postgres psql -c "DROP DATABASE IF EXISTS notemaster;" 2>/dev/null || print_warning "Database may not exist"
            sudo -u postgres psql -c "DROP USER IF EXISTS notemaster;" 2>/dev/null || print_warning "Database user may not exist"
            print_success "Database removed"
        else
            print_warning "PostgreSQL not found, skipping database removal"
        fi
    else
        print_warning "Database kept (you can remove it manually later)"
    fi
}

remove_pm2_startup() {
    print_step "Removing PM2 startup configuration..."
    
    if command -v pm2 &> /dev/null; then
        pm2 unstartup 2>/dev/null || true
        print_success "PM2 startup removed"
    fi
}

cleanup_backups() {
    print_step "Handling backup files..."
    
    if [[ -d "$BACKUP_DIR" ]]; then
        echo "Backup directory exists at: $BACKUP_DIR"
        echo "Would you like to remove all backups?"
        read -p "Remove backups? (yes/NO): " -r
        echo
        
        if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            rm -rf "$BACKUP_DIR"
            print_success "Backups removed"
        else
            print_success "Backups kept at $BACKUP_DIR"
        fi
    fi
}

show_summary() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}║     Uninstall Complete!                ║${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
    print_success "NoteMaster has been uninstalled from your system"
    echo ""
    
    if [[ -d "$BACKUP_DIR" ]]; then
        echo "Your data has been backed up to:"
        echo "  $BACKUP_DIR"
        echo ""
    fi
    
    echo "What was removed:"
    echo "  ✓ Application files ($APP_DIR)"
    echo "  ✓ PM2 process"
    echo "  ✓ Nginx configuration"
    echo ""
    
    echo "What you may need to manually remove:"
    echo "  • PostgreSQL database (if you chose to keep it)"
    echo "  • Backup files ($BACKUP_DIR)"
    echo "  • Node.js (if not used by other apps)"
    echo "  • PM2 (if not used by other apps)"
    echo "  • Nginx (if not used by other apps)"
    echo ""
    
    echo "To completely remove dependencies:"
    echo "  sudo apt remove nodejs npm postgresql nginx pm2 -y"
    echo "  sudo apt autoremove -y"
    echo ""
}

#############################################
# Main Uninstall Flow
#############################################

main() {
    print_header
    
    # Pre-flight checks
    check_installation
    
    # Confirm uninstall
    confirm_action "⚠️  This will uninstall NoteMaster from your system."
    
    # Create backup first
    backup_data
    
    # Stop the application
    stop_application
    
    # Remove components
    remove_nginx_config
    remove_pm2_startup
    remove_application
    remove_database
    cleanup_backups
    
    # Show summary
    show_summary
}

# Run main function
main "$@"
