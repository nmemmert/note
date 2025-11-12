# NoteMaster - Docker Containerization Guide

Last Updated: November 12, 2025

## 📋 Overview

This guide covers how to containerize NoteMaster for development and production deployment. It addresses all potential issues and provides complete Docker configurations.

---

## ⚠️ Issues to Address Before Containerization

### 1. **SQLite Database (CRITICAL)**

**Current State:** Using SQLite (`prisma/dev.db`)

**Problem:** 
- ❌ Data lost on container restart (ephemeral filesystem)
- ❌ Cannot scale to multiple containers (file locking)
- ❌ No persistence between deployments

**Solutions:**

#### Option A: Volume Mount (Single Container)
```yaml
volumes:
  - ./prisma:/app/prisma  # Persist database file
```

#### Option B: PostgreSQL (RECOMMENDED for Production)
```env
DATABASE_URL="postgresql://notemaster:password@postgres:5432/notemaster"
```

### 2. **Environment Variables**

`.env` file won't be included in container image.

**Solution:**
```yaml
environment:
  - DATABASE_URL=${DATABASE_URL}
  - NEXTAUTH_URL=${NEXTAUTH_URL}
  - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
```

### 3. **File Uploads/Attachments**

Images and attachments stored in container filesystem will be lost on restart.

**Solution:**
```yaml
volumes:
  - ./uploads:/app/public/uploads  # Persist uploaded files
```

### 4. **Next.js Build Cache**

`.next` directory needs to be properly handled in multi-stage builds.

### 5. **Prisma Client Generation**

Prisma client must be generated in container environment.

**Solution:**
```dockerfile
RUN npx prisma generate
```

### 6. **Port Configuration**

Next.js runs on port 3000 by default.

**Solution:**
```dockerfile
EXPOSE 3000
ENV PORT=3000
```

### 7. **Node Modules Platform**

Native dependencies might not match container OS.

**Solution:**
```dockerfile
RUN npm rebuild
```

---

## 🐳 Complete Docker Setup

### 1. Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### 2. docker-compose.yml

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: notemaster-db
    environment:
      POSTGRES_USER: notemaster
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-your_secure_password}
      POSTGRES_DB: notemaster
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U notemaster"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - notemaster-network

  app:
    build: .
    container_name: notemaster-app
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://notemaster:${POSTGRES_PASSWORD:-your_secure_password}@postgres:5432/notemaster
      - NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-generate_a_secure_secret_here}
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/public/uploads  # Persist uploads
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - notemaster-network
    command: sh -c "npx prisma migrate deploy && node server.js"

volumes:
  postgres_data:
    driver: local

networks:
  notemaster-network:
    driver: bridge
```

### 3. .dockerignore

Create `.dockerignore` in project root:

```
# Dependencies
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log

# Build output
.next
out
dist
build

# Environment
.env
.env*.local
.env.production

# Database
prisma/dev.db
prisma/dev.db-journal

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Git
.git
.github
.gitignore

# Testing
coverage
.nyc_output

# Logs
*.log
logs

# Documentation (optional)
README.md
DOCKER.md
TODO.md
```

### 4. Update next.config.ts

Add standalone output for Docker:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker optimization
  // ... rest of your config
};

export default nextConfig;
```

### 5. Create .env.docker

Create `.env.docker` for Docker-specific configuration:

```env
# Database
DATABASE_URL="postgresql://notemaster:your_secure_password@postgres:5432/notemaster"
POSTGRES_PASSWORD=your_secure_password

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_long_random_secret_here_min_32_chars

# App
NODE_ENV=production
PORT=3000
```

---

## 🔄 Migration from SQLite to PostgreSQL

### Step 1: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  notes         Note[]
  notebooks     Notebook[]
}

model Note {
  id          String    @id @default(cuid())
  title       String
  content     String    @db.Text  // PostgreSQL uses @db.Text for large text
  notebookId  String?
  tags        String?
  pinned      Boolean   @default(false)
  archived    Boolean   @default(false)
  favorite    Boolean   @default(false)
  dueDate     DateTime?
  completed   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  notebook    Notebook? @relation(fields: [notebookId], references: [id])
  
  @@index([userId])
  @@index([notebookId])
  @@index([createdAt])
}

model Notebook {
  id          String   @id @default(cuid())
  name        String
  description String?
  parentId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  notes       Note[]
  parent      Notebook?  @relation("NotebookHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children    Notebook[] @relation("NotebookHierarchy")
  
  @@index([userId])
  @@index([parentId])
}
```

### Step 2: Remove Old Migrations

```bash
# Backup your data first!
rm -rf prisma/migrations
```

### Step 3: Create New Migration

```bash
# With Docker
docker-compose exec app npx prisma migrate dev --name init

# Without Docker (local PostgreSQL)
npx prisma migrate dev --name init
```

---

## 🚀 Build and Run

### Development with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Stop services
docker-compose down

# Stop and remove volumes (DELETES DATA)
docker-compose down -v
```

### Production Build

```bash
# Build production image
docker build -t notemaster:latest .

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e NEXTAUTH_SECRET="your-secret" \
  --name notemaster \
  notemaster:latest
```

---

## 🔧 Useful Docker Commands

### Container Management

```bash
# View running containers
docker-compose ps

# Access container shell
docker-compose exec app sh

# View app logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Rebuild specific service
docker-compose build app
docker-compose up -d app
```

### Database Operations

```bash
# Run Prisma Studio
docker-compose exec app npx prisma studio

# Create migration
docker-compose exec app npx prisma migrate dev --name migration_name

# Reset database (DELETES ALL DATA)
docker-compose exec app npx prisma migrate reset

# Seed database
docker-compose exec app npx prisma db seed

# Access PostgreSQL directly
docker-compose exec postgres psql -U notemaster -d notemaster
```

### Backup and Restore

```bash
# Backup database
docker-compose exec postgres pg_dump -U notemaster notemaster > backup.sql

# Restore database
docker-compose exec -T postgres psql -U notemaster notemaster < backup.sql

# Backup uploads
tar -czf uploads-backup.tar.gz uploads/
```

---

## 📊 What Will Break vs What Won't

### ❌ WILL Break Without Fixes:

1. **SQLite database** - Data lost on container restart
2. **File uploads** - Lost without volume mount
3. **Environment variables** - Not available without explicit configuration
4. **Sessions** - Lost if using file-based storage
5. **Hot reload** - Development mode doesn't work in production container

### ✅ WON'T Break:

1. **Next.js app** - Works perfectly
2. **React components** - All functional
3. **API routes** - No issues
4. **Authentication** - Works with proper env vars
5. **Prisma queries** - Works once DB configured
6. **Static assets** - Served correctly
7. **Theme system** - Fully functional
8. **AI features** - All working
9. **Help center** - No issues
10. **All completed features** - 100% compatible

---

## 🎯 Recommended Setup

### For Development:

**Option 1: Keep SQLite Locally**
- Use SQLite for local development
- Use Docker + PostgreSQL for testing deployment

**Option 2: PostgreSQL Everywhere**
- Run PostgreSQL in Docker locally
- Same setup as production

### For Production:

**Must Have:**
1. ✅ PostgreSQL database (not SQLite)
2. ✅ Volume mounts for uploads
3. ✅ Environment variables via secrets
4. ✅ Health checks configured
5. ✅ Proper logging setup

**Recommended:**
1. Use managed database (AWS RDS, Railway, Supabase)
2. Object storage for uploads (S3, Cloudflare R2)
3. Container orchestration (Kubernetes, Docker Swarm)
4. Load balancer for multiple instances
5. Monitoring and alerting
6. Automated backups

---

## 🔐 Security Best Practices

### Environment Secrets

```bash
# Generate secure secret
openssl rand -base64 32

# Use Docker secrets (Docker Swarm)
docker secret create nextauth_secret my_secret.txt

# Use .env file with docker-compose
docker-compose --env-file .env.production up -d
```

### Database Security

```yaml
# Use strong passwords
POSTGRES_PASSWORD: $(openssl rand -base64 32)

# Restrict network access
networks:
  notemaster-network:
    internal: true  # No external access
```

### Container Security

```dockerfile
# Run as non-root user
USER nextjs

# Use read-only filesystem where possible
RUN chmod -R 555 /app

# Scan for vulnerabilities
# docker scan notemaster:latest
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Can't reach database"**
```bash
# Check if postgres is running
docker-compose ps postgres

# Check connection
docker-compose exec app npx prisma db push
```

**Issue: "Migration failed"**
```bash
# Reset and retry
docker-compose exec app npx prisma migrate reset
docker-compose exec app npx prisma migrate deploy
```

**Issue: "Port already in use"**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

**Issue: "Out of disk space"**
```bash
# Clean up Docker
docker system prune -a --volumes

# Remove unused images
docker image prune -a
```

**Issue: "Build fails"**
```bash
# Clear build cache
docker-compose build --no-cache

# Remove old containers
docker-compose down --rmi all
```

---

## 📦 Deployment Platforms

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render
```yaml
# render.yaml
services:
  - type: web
    name: notemaster
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: notemaster-db
          property: connectionString
```

### DigitalOcean App Platform
```yaml
# .do/app.yaml
name: notemaster
services:
  - name: web
    dockerfile_path: Dockerfile
    github:
      repo: your-username/notemaster
      branch: main
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
databases:
  - name: db
    engine: PG
    version: "16"
```

### AWS ECS/Fargate
```bash
# Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin
docker build -t notemaster .
docker tag notemaster:latest your-ecr-url/notemaster:latest
docker push your-ecr-url/notemaster:latest
```

---

## 📝 Next Steps

1. **Test locally first**
   - Build Docker image
   - Run with docker-compose
   - Test all features
   - Verify data persistence

2. **Migrate to PostgreSQL**
   - Update schema
   - Create new migrations
   - Test thoroughly

3. **Set up CI/CD**
   - GitHub Actions for builds
   - Automated testing
   - Automatic deployments

4. **Configure monitoring**
   - Log aggregation
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

5. **Plan scaling**
   - Load balancing
   - Database replicas
   - CDN for static assets
   - Caching layer (Redis)

---

## 🎓 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Container Security Best Practices](https://docs.docker.com/engine/security/)

---

**NoteMaster Docker Setup** - Ready for containerization when you are!

Remember to backup your data before switching from SQLite to PostgreSQL!
