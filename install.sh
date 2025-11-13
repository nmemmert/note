#!/bin/bash

#############################################
# NoteMaster - Automated Ubuntu Installer
# One-command installation script
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
DEFAULT_PORT=3000
POSTGRES_PORT=5432
APP_PORT=$DEFAULT_PORT
DOMAIN=""
EMAIL_HOST=""
EMAIL_PORT=""
EMAIL_USER=""
EMAIL_PASS=""

#############################################
# Utility Functions
#############################################

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}║     NoteMaster Automated Installer     ║${NC}"
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

check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should NOT be run as root (sudo will be used when needed)"
        exit 1
    fi
}

check_ubuntu() {
    if [[ ! -f /etc/os-release ]]; then
        print_error "Cannot detect OS version"
        exit 1
    fi
    
    . /etc/os-release
    if [[ "$ID" != "ubuntu" ]] && [[ "$ID" != "debian" ]]; then
        print_warning "This script is designed for Ubuntu/Debian. Detected: $ID"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    print_success "Running on $ID $VERSION_ID"
}

prompt_domain() {
    print_step "Domain Configuration"
    echo ""
    echo -e "${YELLOW}Enter your domain name (or press Enter to use IP address):${NC}"
    echo -e "${BLUE}Examples: notemaster.example.com or leave blank for IP-based access${NC}"
    read -p "Domain: " DOMAIN
    
    if [[ -z "$DOMAIN" ]]; then
        DOMAIN=$(hostname -I | awk '{print $1}')
        print_success "Using IP address: $DOMAIN"
    else
        print_success "Using domain: $DOMAIN"
    fi
    echo ""
}

prompt_email() {
    print_step "Email Configuration (for sharing and invitations)"
    echo ""
    echo -e "${YELLOW}Configure email sending? This enables share links and email invitations (y/N):${NC}"
    read -p "Setup email? " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo -e "${BLUE}Recommended free SMTP services:${NC}"
        echo "  1. Gmail (smtp.gmail.com:587) - Use App Password"
        echo "  2. SendGrid (smtp.sendgrid.net:587) - 100 emails/day free"
        echo "  3. Mailgun (smtp.mailgun.org:587) - 5000 emails/month free"
        echo "  4. Brevo/Sendinblue (smtp-relay.brevo.com:587) - 300 emails/day free"
        echo ""
        
        read -p "SMTP Host (e.g., smtp.gmail.com): " EMAIL_HOST
        read -p "SMTP Port (usually 587 or 465): " EMAIL_PORT
        read -p "Email Username/Address: " EMAIL_USER
        read -sp "Email Password/API Key: " EMAIL_PASS
        echo ""
        
        if [[ -n "$EMAIL_HOST" ]] && [[ -n "$EMAIL_PORT" ]] && [[ -n "$EMAIL_USER" ]] && [[ -n "$EMAIL_PASS" ]]; then
            print_success "Email configuration saved"
        else
            print_warning "Email configuration incomplete, skipping email setup"
            EMAIL_HOST=""
        fi
    else
        print_warning "Skipping email configuration"
    fi
    echo ""
}

check_port() {
    local port=$1
    if command -v lsof &> /dev/null; then
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            return 1  # Port is in use
        else
            return 0  # Port is available
        fi
    else
        # Fallback if lsof not available
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            return 1
        else
            return 0
        fi
    fi
}

find_available_port() {
    local start_port=$1
    local port=$start_port
    
    # Send messages to stderr so they don't get captured in output
    print_step "Checking if port $port is available..." >&2
    
    while ! check_port $port; do
        print_warning "Port $port is in use, trying next port..." >&2
        port=$((port + 1))
        if [[ $port -gt 65535 ]]; then
            print_error "No available ports found" >&2
            exit 1
        fi
    done
    
    if [[ $port -ne $start_port ]]; then
        print_success "Found available port: $port" >&2
    else
        print_success "Port $port is available" >&2
    fi
    
    # Only echo the port number to stdout
    echo $port
}

#############################################
# Installation Functions
#############################################

update_system() {
    print_step "Updating system packages..."
    sudo apt update -qq
    sudo apt upgrade -y -qq
    sudo apt install -y curl wget git lsof net-tools
    print_success "System updated"
}

install_nodejs() {
    print_step "Installing Node.js 20..."
    
    # Check if Node.js is already installed
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -ge 20 ]]; then
            print_success "Node.js $(node -v) already installed"
            return
        else
            print_warning "Node.js $NODE_VERSION found, upgrading to v20..."
        fi
    fi
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Verify installation
    if command -v node &> /dev/null; then
        print_success "Node.js $(node -v) installed"
        print_success "npm $(npm -v) installed"
    else
        print_error "Node.js installation failed"
        exit 1
    fi
}

install_postgresql() {
    print_step "Installing PostgreSQL..."
    
    # Check if PostgreSQL is already installed
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL already installed"
        sudo systemctl start postgresql 2>/dev/null || true
        sudo systemctl enable postgresql 2>/dev/null || true
        return
    fi
    
    sudo apt install -y postgresql postgresql-contrib
    
    # Start PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Wait for PostgreSQL to be ready
    sleep 3
    
    print_success "PostgreSQL installed and started"
}

setup_database() {
    print_step "Setting up database..."
    
    # Generate secure password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Create database and user
    sudo -u postgres psql <<EOF 2>/dev/null || true
-- Drop if exists (for reinstallation)
DROP DATABASE IF EXISTS notemaster;
DROP USER IF EXISTS notemaster;
EOF

    sudo -u postgres psql <<EOF
-- Create user and database
CREATE USER notemaster WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE notemaster OWNER notemaster;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE notemaster TO notemaster;
\q
EOF

    print_success "Database 'notemaster' created"
    
    # Save password temporarily
    mkdir -p "$HOME/.notemaster"
    echo "$DB_PASSWORD" > "$HOME/.notemaster/.db_password"
    chmod 600 "$HOME/.notemaster/.db_password"
}

install_pm2() {
    print_step "Installing PM2 process manager..."
    
    if command -v pm2 &> /dev/null; then
        print_success "PM2 already installed"
        return
    fi
    
    sudo npm install -g pm2
    
    # Setup PM2 to start on boot
    PM2_STARTUP=$(pm2 startup | grep 'sudo')
    if [[ ! -z "$PM2_STARTUP" ]]; then
        eval $PM2_STARTUP 2>/dev/null || true
    fi
    
    print_success "PM2 installed"
}

install_nginx() {
    print_step "Installing Nginx..."
    
    if command -v nginx &> /dev/null; then
        print_success "Nginx already installed"
        sudo systemctl start nginx 2>/dev/null || true
        sudo systemctl enable nginx 2>/dev/null || true
        return
    fi
    
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    print_success "Nginx installed and started"
}

setup_application() {
    print_step "Setting up application..."
    
    # Create app directory if it doesn't exist
    if [[ -d "$APP_DIR" ]]; then
        print_warning "Directory $APP_DIR already exists"
        read -p "Remove and reinstall? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            pm2 delete notemaster 2>/dev/null || true
            rm -rf "$APP_DIR"
        else
            print_error "Installation cancelled"
            exit 1
        fi
    fi
    
    mkdir -p "$APP_DIR"
    
    # Copy files from current directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    
    if [[ -f "$SCRIPT_DIR/package.json" ]]; then
        print_step "Copying application files..."
        cp -r "$SCRIPT_DIR"/* "$APP_DIR/" 2>/dev/null || true
        cp -r "$SCRIPT_DIR"/.[!.]* "$APP_DIR/" 2>/dev/null || true
        print_success "Files copied to $APP_DIR"
    else
        print_error "package.json not found. Please run this script from the NoteMaster repository directory"
        exit 1
    fi
    
    cd "$APP_DIR"
}

create_env_file() {
    print_step "Creating environment configuration..."
    
    # Read password from saved file
    DB_PASSWORD=$(cat "$HOME/.notemaster/.db_password")
    
    # Generate NextAuth secret
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    # Determine base URL
    if [[ -z "$DOMAIN" ]]; then
        SERVER_IP=$(hostname -I | awk '{print $1}')
        BASE_URL="http://${SERVER_IP}"
    else
        BASE_URL="http://${DOMAIN}"
    fi
    
    # Create .env file
    cat > "$APP_DIR/.env" <<EOF
# Database Configuration
DATABASE_URL="postgresql://notemaster:${DB_PASSWORD}@localhost:5432/notemaster"

# NextAuth Configuration
NEXTAUTH_URL="${BASE_URL}:${APP_PORT}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# App Configuration
NODE_ENV=production
PORT=${APP_PORT}
NEXT_PUBLIC_APP_URL="${BASE_URL}:${APP_PORT}"
EOF

    # Add email configuration if provided
    if [[ -n "$EMAIL_HOST" ]]; then
        cat >> "$APP_DIR/.env" <<EOF

# Email Configuration
EMAIL_SERVER_HOST="${EMAIL_HOST}"
EMAIL_SERVER_PORT="${EMAIL_PORT}"
EMAIL_SERVER_USER="${EMAIL_USER}"
EMAIL_SERVER_PASSWORD="${EMAIL_PASS}"
EMAIL_FROM="${EMAIL_USER}"
EOF
        print_success "Email configuration added to .env"
    fi

    chmod 600 "$APP_DIR/.env"
    print_success "Environment file created"
}

update_prisma_schema() {
    print_step "Updating Prisma schema for PostgreSQL..."
    
    # Update schema to use PostgreSQL
    if [[ -f "$APP_DIR/prisma/schema.prisma" ]]; then
        sed -i 's/provider = "sqlite"/provider = "postgresql"/' "$APP_DIR/prisma/schema.prisma"
        print_success "Prisma schema updated"
    fi
}

install_dependencies() {
    print_step "Installing application dependencies..."
    cd "$APP_DIR"
    # Install all dependencies (including devDependencies needed for build)
    npm install
    print_success "Dependencies installed"
}

setup_prisma() {
    print_step "Setting up database schema..."
    cd "$APP_DIR"
    
    # Generate Prisma client
    npx prisma generate
    
    # Run migrations
    npx prisma migrate deploy 2>/dev/null || npx prisma db push
    
    print_success "Database schema initialized"
}

build_application() {
    print_step "Building application..."
    cd "$APP_DIR"
    npm run build
    print_success "Application built"
}

configure_nginx() {
    print_step "Configuring Nginx reverse proxy..."
    
    # Use domain or IP
    if [[ -z "$DOMAIN" ]]; then
        SERVER_NAME=$(hostname -I | awk '{print $1}')
    else
        SERVER_NAME="$DOMAIN"
    fi
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/notemaster > /dev/null <<EOF
server {
    listen 80;
    server_name ${SERVER_NAME} localhost;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/notemaster /etc/nginx/sites-enabled/notemaster
    
    # Remove default site if it exists
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Reload Nginx
    sudo systemctl reload nginx
    
    print_success "Nginx configured for ${SERVER_NAME}"
}

start_application() {
    print_step "Starting application with PM2..."
    cd "$APP_DIR"
    
    # Stop if already running
    pm2 delete notemaster 2>/dev/null || true
    
    # Start application
    pm2 start npm --name "notemaster" -- start
    pm2 save
    
    # Wait for app to start
    sleep 5
    
    print_success "Application started"
}

setup_firewall() {
    print_step "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        sudo ufw allow 80/tcp comment 'Nginx HTTP' 2>/dev/null || true
        sudo ufw allow 443/tcp comment 'Nginx HTTPS' 2>/dev/null || true
        
        # Only enable if not already enabled
        if ! sudo ufw status | grep -q "Status: active"; then
            print_warning "UFW firewall is inactive. Enable it? (y/N)"
            read -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                sudo ufw --force enable
                print_success "Firewall enabled"
            fi
        else
            print_success "Firewall configured"
        fi
    else
        print_warning "UFW not installed, skipping firewall configuration"
    fi
}

create_backup_script() {
    print_step "Creating backup script..."
    
    cat > "$APP_DIR/backup.sh" <<'EOF'
#!/bin/bash

BACKUP_DIR="$HOME/notemaster-backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup database
sudo -u postgres pg_dump notemaster | gzip > "$BACKUP_DIR/notemaster_db_${DATE}.sql.gz"

# Backup uploads
tar -czf "$BACKUP_DIR/notemaster_uploads_${DATE}.tar.gz" -C "$HOME/notemaster/public" uploads 2>/dev/null || true

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "notemaster_*" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
EOF

    chmod +x "$APP_DIR/backup.sh"
    print_success "Backup script created at $APP_DIR/backup.sh"
}

print_summary() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}║     Installation Complete! 🎉          ║${NC}"
    echo -e "${BLUE}║                                        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    SERVER_IP=$(hostname -I | awk '{print $1}')
    local ACCESS_URL
    
    if [[ -z "$DOMAIN" ]]; then
        ACCESS_URL="http://${SERVER_IP}"
    else
        ACCESS_URL="http://${DOMAIN}"
    fi
    
    print_success "NoteMaster is now running!"
    echo ""
    echo -e "${GREEN}Access your app at:${NC}"
    echo -e "  ${BLUE}${ACCESS_URL}:${APP_PORT}${NC}"
    echo -e "  ${BLUE}http://localhost:${APP_PORT}${NC} (from this machine)"
    echo ""
    
    if [[ -n "$EMAIL_HOST" ]]; then
        echo -e "${GREEN}✓ Email configured:${NC} Share links and invitations enabled"
        echo -e "  SMTP: ${EMAIL_HOST}:${EMAIL_PORT}"
        echo ""
    else
        echo -e "${YELLOW}⚠ Email not configured:${NC} Share links will work, but email invitations disabled"
        echo -e "  To add email later, edit ${BLUE}$APP_DIR/.env${NC} and restart"
        echo ""
    fi
    
    echo -e "${GREEN}Application directory:${NC}"
    echo -e "  ${BLUE}$APP_DIR${NC}"
    echo ""
    echo -e "${GREEN}Useful commands:${NC}"
    echo -e "  View logs:        ${BLUE}pm2 logs notemaster${NC}"
    echo -e "  Restart app:      ${BLUE}pm2 restart notemaster${NC}"
    echo -e "  Stop app:         ${BLUE}pm2 stop notemaster${NC}"
    echo -e "  Start app:        ${BLUE}pm2 start notemaster${NC}"
    echo -e "  App status:       ${BLUE}pm2 status${NC}"
    echo -e "  Create backup:    ${BLUE}$APP_DIR/backup.sh${NC}"
    echo ""
    echo -e "${GREEN}Database credentials saved to:${NC}"
    echo -e "  ${BLUE}$HOME/.notemaster/.db_password${NC}"
    echo ""
    
    if [[ $APP_PORT -ne $DEFAULT_PORT ]]; then
        print_warning "App is running on port $APP_PORT (default port $DEFAULT_PORT was in use)"
    fi
    
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Create your first user account"
    
    if [[ -n "$DOMAIN" ]]; then
        echo "  2. Set up SSL certificate for HTTPS:"
        echo -e "     ${BLUE}sudo apt install certbot python3-certbot-nginx${NC}"
        echo -e "     ${BLUE}sudo certbot --nginx -d $DOMAIN${NC}"
    else
        echo "  2. (Optional) Set up a domain name and SSL certificate"
    fi
    
    echo "  3. (Optional) Configure automatic backups with cron"
    echo ""
    
    if [[ -z "$EMAIL_HOST" ]]; then
        echo -e "${YELLOW}To enable email invitations later:${NC}"
        echo "  Free SMTP options:"
        echo "    • Gmail: smtp.gmail.com:587 (use App Password)"
        echo "    • SendGrid: smtp.sendgrid.net:587 (100/day free)"
        echo "    • Mailgun: smtp.mailgun.org:587 (5000/month free)"
        echo "    • Brevo: smtp-relay.brevo.com:587 (300/day free)"
        echo ""
        echo "  Add to ${BLUE}$APP_DIR/.env${NC}:"
        echo "    EMAIL_SERVER_HOST=smtp.gmail.com"
        echo "    EMAIL_SERVER_PORT=587"
        echo "    EMAIL_SERVER_USER=your@email.com"
        echo "    EMAIL_SERVER_PASSWORD=your-password"
        echo "    EMAIL_FROM=your@email.com"
        echo ""
        echo "  Then restart: ${BLUE}pm2 restart notemaster${NC}"
        echo ""
    fi
    
    echo -e "${GREEN}Setup automatic daily backups (optional):${NC}"
    echo -e "  ${BLUE}(crontab -l 2>/dev/null; echo \"0 2 * * * $APP_DIR/backup.sh\") | crontab -${NC}"
    echo ""
}

#############################################
# Main Installation Flow
#############################################

main() {
    print_header
    
    # Pre-flight checks
    check_root
    check_ubuntu
    
    # Configuration prompts
    prompt_domain
    prompt_email
    
    # Find available port
    APP_PORT=$(find_available_port $DEFAULT_PORT)
    
    # Installation steps
    update_system
    install_nodejs
    install_postgresql
    setup_database
    install_pm2
    install_nginx
    setup_application
    create_env_file
    update_prisma_schema
    install_dependencies
    setup_prisma
    build_application
    configure_nginx
    start_application
    setup_firewall
    create_backup_script
    
    # Clean up temp files
    rm -f "$HOME/.notemaster/.db_password"
    
    # Print summary
    print_summary
}

# Run main function
main "$@"
