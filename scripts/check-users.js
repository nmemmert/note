#!/usr/bin/env node

/**
 * Simple script to check users in the database
 * Works on any server with Node.js installed
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Connecting to database...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            notes: true,
            notebooks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (users.length === 0) {
      console.log('❌ No users found in the database\n');
      console.log('To create a user:');
      console.log('  Visit: http://your-server:3000/auth/signup');
      console.log('  Or use the install.sh script initialization\n');
    } else {
      console.log(`✅ Found ${users.length} user${users.length > 1 ? 's' : ''} in database\n`);
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Name:      ${user.name || '(not set)'}`);
        console.log(`   User ID:   ${user.id}`);
        console.log(`   Created:   ${user.createdAt.toLocaleString()}`);
        console.log(`   Notebooks: ${user._count.notebooks}`);
        console.log(`   Notes:     ${user._count.notes}`);
        console.log('');
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database Connection Info:');
    
    const dbUrl = process.env.DATABASE_URL || 'Not configured';
    const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
    console.log(`   URL: ${maskedUrl}`);
    
    // Check database type
    if (dbUrl.includes('postgresql://')) {
      console.log('   Type: PostgreSQL');
    } else if (dbUrl.includes('file:')) {
      console.log('   Type: SQLite');
    } else {
      console.log('   Type: Unknown');
    }
    
    console.log('   Status: ✅ Connected');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ DATABASE ERROR\n');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('   1. Check if .env file exists with DATABASE_URL');
    console.log('   2. Verify database is running (if PostgreSQL)');
    console.log('   3. Run: npx prisma migrate deploy');
    console.log('   4. Run: npx prisma generate');
    console.log('   5. Check database file permissions (if SQLite)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkUsers();
