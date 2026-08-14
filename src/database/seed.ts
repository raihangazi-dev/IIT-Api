import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL as string) });

async function main() {
  const adminPasswordHash = await argon2.hash('Admin@1234');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iit-test.com' },
    update: {},
    create: {
      name: 'IIT Admin',
      email: 'admin@iit-test.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('Seeded admin user:', admin.email);

  const alumniPasswordHash = await argon2.hash('Alumni@1234');
  const alumniUser = await prisma.user.upsert({
    where: { email: 'alumni@iit-test.com' },
    update: { role: 'ALUMNI' },
    create: {
      name: 'Rafiq Ahmed',
      email: 'alumni@iit-test.com',
      passwordHash: alumniPasswordHash,
      role: 'ALUMNI',
      emailVerified: true,
    },
  });
  await prisma.alumniProfile.upsert({
    where: { email: alumniUser.email },
    update: {},
    create: {
      userId: alumniUser.id,
      name: alumniUser.name,
      email: alumniUser.email,
      phone: '+880 1XXX-XXXXXX',
      designation: 'Trade Finance Manager',
      organization: 'Standard Bank',
      country: 'Bangladesh',
      batch: '2019',
      certification: 'CDCS',
      type: 'AUTOMATIC',
    },
  });
  console.log('Seeded verified alumni user:', alumniUser.email);

  const pendingPasswordHash = await argon2.hash('Pending@1234');
  const pendingUser = await prisma.user.upsert({
    where: { email: 'pending@iit-test.com' },
    update: {},
    create: {
      name: 'Tasnim Rahman',
      email: 'pending@iit-test.com',
      passwordHash: pendingPasswordHash,
      role: 'USER',
      emailVerified: true,
    },
  });
  await prisma.alumniApplication.upsert({
    where: { id: 'seed-pending-application' },
    update: {},
    create: {
      id: 'seed-pending-application',
      fullName: pendingUser.name,
      email: pendingUser.email,
      phone: '+880 1XXX-XXXXXX',
      designation: 'Trade Operations Officer',
      organization: 'ILB Bangladesh',
      certification: 'CDCS',
      yearCompleted: '2024',
      status: 'PENDING',
    },
  });
  console.log('Seeded pending applicant user:', pendingUser.email);

  await prisma.alumniPrivilegeDefaults.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
