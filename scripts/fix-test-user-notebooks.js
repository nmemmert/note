const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { notebooks: true }
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  if (user.notebooks.length > 0) {
    console.log('✅ User already has notebooks:', user.notebooks.map(n => n.name).join(', '));
    return;
  }

  // Create default notebooks for test user
  const notebooks = [
    { id: 'general', name: 'General', icon: '📝' },
    { id: 'personal', name: 'Personal', icon: '👤' },
    { id: 'work', name: 'Work', icon: '💼' },
  ];

  for (const nb of notebooks) {
    await prisma.notebook.create({
      data: {
        id: nb.id,
        name: nb.name,
        icon: nb.icon,
        userId: user.id,
      }
    });
  }

  console.log('✅ Added 3 notebooks to test user!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
