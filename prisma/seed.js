const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const pw = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: pw
    }
  });

  const poll = await prisma.poll.create({
    data: {
      question: 'Which is your favorite programming language?',
      isPublished: true,
      creatorId: alice.id,
      options: {
        create: [
          { text: 'JavaScript' },
          { text: 'Python' },
          { text: 'Go' },
          { text: 'Rust' }
        ]
      }
    },
    include: { options: true }
  });

  console.log({ alice, poll });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
