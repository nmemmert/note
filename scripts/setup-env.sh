#!/bin/bash

#############################################
# NoteMaster - Environment Setup Script
# Creates .env file for production deployment
#############################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NoteMaster Environment Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "✅ Keeping existing .env file"
        exit 0
    fi
fi

# Database setup
echo "📊 Database Configuration"
echo "1) SQLite (simple, file-based)"
echo "2) PostgreSQL (production, scalable)"
read -p "Choose database [1-2] (default: 1): " db_choice
echo ""

if [ "$db_choice" = "2" ]; then
    # PostgreSQL
    read -p "PostgreSQL host [localhost]: " pg_host
    pg_host=${pg_host:-localhost}
    
    read -p "PostgreSQL port [5432]: " pg_port
    pg_port=${pg_port:-5432}
    
    read -p "Database name [notemaster]: " pg_db
    pg_db=${pg_db:-notemaster}
    
    read -p "PostgreSQL user [notemaster]: " pg_user
    pg_user=${pg_user:-notemaster}
    
    read -sp "PostgreSQL password: " pg_pass
    echo ""
    
    DATABASE_URL="postgresql://${pg_user}:${pg_pass}@${pg_host}:${pg_port}/${pg_db}"
else
    # SQLite (default)
    DATABASE_URL="file:./prisma/dev.db"
    echo "Using SQLite database: prisma/dev.db"
fi

echo ""
echo "🌐 Server Configuration"
read -p "Server URL (e.g., http://localhost:3000): " server_url
NEXTAUTH_URL=${server_url:-http://localhost:3000}

# Generate secure secret
echo ""
echo "🔐 Generating secure authentication secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

# Create .env file
cat > .env << EOF
# NoteMaster Environment Configuration
# Generated on $(date)

# Database Connection
DATABASE_URL="${DATABASE_URL}"

# NextAuth.js Authentication
NEXTAUTH_URL="${NEXTAUTH_URL}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# Application Settings
NODE_ENV=production
PORT=3000
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ .env file created successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Configuration Summary:"
if [ "$db_choice" = "2" ]; then
    echo "   Database: PostgreSQL"
    echo "   Host: ${pg_host}:${pg_port}"
    echo "   Database: ${pg_db}"
else
    echo "   Database: SQLite (prisma/dev.db)"
fi
echo "   Server URL: ${NEXTAUTH_URL}"
echo "   Auth Secret: [generated]"
echo ""

# Setup Prisma
echo "🔧 Setting up Prisma..."
npx prisma generate

if [ "$db_choice" = "1" ]; then
    # For SQLite, ensure directory exists
    mkdir -p prisma
fi

echo ""
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo "   1. Check users: npm run check-users"
echo "   2. Build app: npm run build"
echo "   3. Start app: npm start"
echo ""
echo "   Or use PM2:"
echo "   pm2 start npm --name notemaster -- start"
echo ""
