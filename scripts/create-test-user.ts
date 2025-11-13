import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'password123';
  const name = 'Test User';

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log('User already exists!');
    console.log('Email:', email);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  });

  // Create default notebooks
  await prisma.notebook.createMany({
    data: [
      {
        id: 'general',
        name: 'General',
        icon: '📝',
        userId: user.id,
      },
      {
        id: 'personal',
        name: 'Personal',
        icon: '👤',
        userId: user.id,
      },
      {
        id: 'work',
        name: 'Work',
        icon: '💼',
        userId: user.id,
      }
    ]
  });

  console.log('✅ Test user created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');
  console.log('Visit http://localhost:3000/auth/signin to log in');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
