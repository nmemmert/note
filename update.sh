#!/bin/bash

#############################################
# NoteMaster - Update Script
# Safely update NoteMaster to latest version
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
CURRENT_DATE=$(date +%Y%m%d_%H%M%S)

#############################################
# Utility Functions
#############################################

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}║     NoteMaster Update Script           ║${NC}"
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

check_installation() {
    if [[ ! -d "$APP_DIR" ]]; then
        print_error "NoteMaster is not installed at $APP_DIR"
        print_error "Please install NoteMaster first using install.sh"
        exit 1
    fi
    
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed. Cannot manage application."
        exit 1
    fi
    
    print_success "Installation found at $APP_DIR"
}

check_git_repo() {
    cd "$APP_DIR"
    
    if [[ ! -d ".git" ]]; then
        print_warning "Not a git repository. Cannot check for updates."
        print_warning "Manual update required."
        exit 1
    fi
    
    print_success "Git repository detected"
}

fetch_updates() {
    print_step "Checking for updates..."
    cd "$APP_DIR"
    
    # Fetch latest changes
    git fetch origin
    
    # Get current and remote commit
    LOCAL=$(git rev-parse @)
    REMOTE=$(git rev-parse @{u})
    
    if [[ "$LOCAL" == "$REMOTE" ]]; then
        print_success "Already up to date!"
        echo ""
        print_step "Current version: $(git log -1 --format=%h --date=short)"
        echo ""
        read -p "Force reinstall dependencies and rebuild? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
        FORCE_REBUILD=true
    else
        print_warning "Updates available!"
        echo ""
        echo "Changes since your version:"
        git log --oneline HEAD..@{u} --decorate --color=always | head -10
        echo ""
        read -p "Continue with update? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Update cancelled"
            exit 0
        fi
        FORCE_REBUILD=false
    fi
}

create_backup() {
    print_step "Creating backup before update..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup directory
    BACKUP_PATH="$BACKUP_DIR/notemaster-backup-$CURRENT_DATE"
    
    # Copy application directory (excluding node_modules and .next)
    rsync -a --exclude 'node_modules' --exclude '.next' --exclude '.git' "$APP_DIR/" "$BACKUP_PATH/"
    
    # Backup database
    if command -v pg_dump &> /dev/null; then
        sudo -u postgres pg_dump notemaster 2>/dev/null | gzip > "$BACKUP_PATH/database.sql.gz" || {
            print_warning "Could not backup database (may need sudo access)"
        }
    fi
    
    # Save rollback information
    cd "$APP_DIR"
    git rev-parse HEAD > "$BACKUP_PATH/git-commit.txt"
    
    print_success "Backup created at $BACKUP_PATH"
    echo "$BACKUP_PATH" > /tmp/notemaster-last-backup
}

stop_application() {
    print_step "Stopping application..."
    
    pm2 stop notemaster 2>/dev/null || true
    sleep 2
    
    print_success "Application stopped"
}

pull_updates() {
    print_step "Pulling latest changes..."
    cd "$APP_DIR"
    
    # Stash any local changes
    if [[ -n $(git status -s) ]]; then
        print_warning "Local changes detected, stashing..."
        git stash
    fi
    
    # Pull latest changes
    git pull origin main || git pull origin master
    
    print_success "Code updated"
}

check_schema_changes() {
    print_step "Checking for database schema changes..."
    cd "$APP_DIR"
    
    # Check if prisma schema changed
    if git diff HEAD@{1} HEAD --name-only | grep -q "prisma/schema.prisma"; then
        print_warning "Database schema has changed"
        SCHEMA_CHANGED=true
    else
        print_success "No schema changes detected"
        SCHEMA_CHANGED=false
    fi
}

install_dependencies() {
    print_step "Installing/updating dependencies..."
    cd "$APP_DIR"
    
    # Check if package.json changed or force rebuild
    if [[ "$FORCE_REBUILD" == "true" ]] || git diff HEAD@{1} HEAD --name-only | grep -q "package.json"; then
        print_step "Dependencies changed, running npm install..."
        npm install --production
        print_success "Dependencies updated"
    else
        print_success "No dependency changes, skipping npm install"
    fi
}

update_database() {
    print_step "Updating database schema..."
    cd "$APP_DIR"
    
    # Regenerate Prisma client
    npx prisma generate
    
    if [[ "$SCHEMA_CHANGED" == "true" ]]; then
        print_warning "Applying database migrations..."
        
        # Try to run migrations
        if npx prisma migrate deploy 2>/dev/null; then
            print_success "Migrations applied successfully"
        else
            print_warning "Migration failed, trying db push..."
            if npx prisma db push --accept-data-loss 2>/dev/null; then
                print_success "Database schema updated"
            else
                print_error "Database update failed"
                print_error "You may need to manually fix database issues"
                return 1
            fi
        fi
    else
        print_success "Prisma client regenerated"
    fi
}

build_application() {
    print_step "Building application..."
    cd "$APP_DIR"
    
    # Remove old build
    rm -rf .next
    
    # Build
    npm run build
    
    print_success "Application built"
}

start_application() {
    print_step "Starting application..."
    
    pm2 restart notemaster
    
    # Wait for app to start
    sleep 5
    
    # Check if app is running
    if pm2 list | grep -q "notemaster.*online"; then
        print_success "Application started successfully"
        return 0
    else
        print_error "Application failed to start"
        return 1
    fi
}

verify_update() {
    print_step "Verifying update..."
    
    # Check if app is responding
    APP_PORT=$(grep "PORT=" "$APP_DIR/.env" | cut -d'=' -f2)
    APP_PORT=${APP_PORT:-3000}
    
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT" | grep -q "200\|302"; then
        print_success "Application is responding"
        return 0
    else
        print_error "Application is not responding"
        return 1
    fi
}

cleanup_old_backups() {
    print_step "Cleaning up old backups (keeping last 5)..."
    
    cd "$BACKUP_DIR"
    ls -t | grep "notemaster-backup-" | tail -n +6 | xargs -r rm -rf
    
    print_success "Old backups cleaned up"
}

rollback() {
    print_error "Update failed! Rolling back..."
    
    # Get last backup path
    if [[ -f /tmp/notemaster-last-backup ]]; then
        LAST_BACKUP=$(cat /tmp/notemaster-last-backup)
        
        if [[ -d "$LAST_BACKUP" ]]; then
            print_step "Restoring from backup: $LAST_BACKUP"
            
            # Stop app
            pm2 stop notemaster 2>/dev/null || true
            
            # Get commit hash
            if [[ -f "$LAST_BACKUP/git-commit.txt" ]]; then
                COMMIT=$(cat "$LAST_BACKUP/git-commit.txt")
                cd "$APP_DIR"
                git reset --hard "$COMMIT"
                print_success "Code restored to previous version"
            fi
            
            # Restore files (excluding git)
            rsync -a --exclude '.git' "$LAST_BACKUP/" "$APP_DIR/"
            
            # Restore database if exists
            if [[ -f "$LAST_BACKUP/database.sql.gz" ]]; then
                print_step "Restoring database..."
                gunzip < "$LAST_BACKUP/database.sql.gz" | sudo -u postgres psql notemaster 2>/dev/null || {
                    print_warning "Could not restore database automatically"
                    print_warning "Database backup located at: $LAST_BACKUP/database.sql.gz"
                }
            fi
            
            # Reinstall dependencies and rebuild
            cd "$APP_DIR"
            npm install --production
            npm run build
            
            # Restart app
            pm2 restart notemaster
            
            print_success "Rollback completed"
            print_warning "Please verify the application is working correctly"
        else
            print_error "Backup directory not found: $LAST_BACKUP"
        fi
    else
        print_error "No backup information found"
    fi
}

print_summary() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}║     Update Complete! 🎉                ║${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    SERVER_IP=$(hostname -I | awk '{print $1}')
    APP_PORT=$(grep "PORT=" "$APP_DIR/.env" | cut -d'=' -f2)
    APP_PORT=${APP_PORT:-3000}
    
    print_success "NoteMaster has been updated!"
    echo ""
    echo -e "${GREEN}Access your app at:${NC}"
    echo -e "  ${BLUE}http://localhost:${APP_PORT}${NC}"
    echo -e "  ${BLUE}http://${SERVER_IP}${NC}"
    echo ""
    echo -e "${GREEN}Current version:${NC}"
    cd "$APP_DIR"
    echo -e "  ${BLUE}$(git log -1 --format='%h - %s (%ci)' --date=short)${NC}"
    echo ""
    echo -e "${GREEN}Useful commands:${NC}"
    echo -e "  View logs:        ${BLUE}pm2 logs notemaster${NC}"
    echo -e "  Check status:     ${BLUE}pm2 status${NC}"
    echo -e "  Restart app:      ${BLUE}pm2 restart notemaster${NC}"
    echo ""
    echo -e "${GREEN}Backup location:${NC}"
    echo -e "  ${BLUE}$BACKUP_DIR${NC}"
    echo ""
}

show_rollback_instructions() {
    echo ""
    print_error "Update failed!"
    echo ""
    echo -e "${YELLOW}To manually rollback:${NC}"
    echo ""
    echo "1. Restore from backup:"
    echo -e "   ${BLUE}cd $APP_DIR${NC}"
    
    if [[ -f /tmp/notemaster-last-backup ]]; then
        LAST_BACKUP=$(cat /tmp/notemaster-last-backup)
        echo -e "   ${BLUE}rsync -a --exclude '.git' $LAST_BACKUP/ $APP_DIR/${NC}"
        
        if [[ -f "$LAST_BACKUP/database.sql.gz" ]]; then
            echo ""
            echo "2. Restore database:"
            echo -e "   ${BLUE}gunzip < $LAST_BACKUP/database.sql.gz | sudo -u postgres psql notemaster${NC}"
        fi
    fi
    
    echo ""
    echo "3. Reinstall and restart:"
    echo -e "   ${BLUE}npm install --production${NC}"
    echo -e "   ${BLUE}npm run build${NC}"
    echo -e "   ${BLUE}pm2 restart notemaster${NC}"
    echo ""
}

#############################################
# Main Update Flow
#############################################

main() {
    print_header
    
    # Pre-flight checks
    check_installation
    check_git_repo
    
    # Fetch and check for updates
    fetch_updates
    
    # Create backup before making changes
    create_backup
    
    # Stop the application
    stop_application
    
    # Perform update
    if ! pull_updates; then
        rollback
        exit 1
    fi
    
    # Check for schema changes
    check_schema_changes
    
    # Install/update dependencies
    if ! install_dependencies; then
        rollback
        exit 1
    fi
    
    # Update database
    if ! update_database; then
        rollback
        exit 1
    fi
    
    # Build application
    if ! build_application; then
        rollback
        exit 1
    fi
    
    # Start application
    if ! start_application; then
        print_error "Failed to start application after update"
        show_rollback_instructions
        exit 1
    fi
    
    # Verify update
    if ! verify_update; then
        print_warning "Application started but verification failed"
        print_warning "Please check the application manually"
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Print summary
    print_summary
}

# Handle errors
trap 'print_error "Update failed at line $LINENO"; show_rollback_instructions; exit 1' ERR

# Run main function
main "$@"
