const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      notebooks: true,
      _count: {
        select: { notes: true }
      }
    }
  });

  console.log('\n📋 Users in database:\n');
  
  if (users.length === 0) {
    console.log('No users found! Create one at http://localhost:3000/auth/signup\n');
    return;
  }

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || 'No name'}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   📚 Notebooks: ${user.notebooks.length}`);
    console.log(`   📝 Notes: ${user._count.notes}`);
    console.log(`   🗓️  Created: ${user.createdAt.toLocaleDateString()}`);
    if (user.notebooks.length > 0) {
      console.log(`   Notebooks:`);
      user.notebooks.forEach(nb => {
        console.log(`      ${nb.icon} ${nb.name} (${nb.id})`);
      });
    }
    console.log('');
  });

  console.log(`\n🌐 Visit http://localhost:3000/auth/signin to log in\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
