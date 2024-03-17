import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

import { SignIn, SignOut } from '@/components/auth-components';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await auth();

  await prisma.log.create({
    data: {
      level: 'Info',
      message: 'test',
      meta: {
        headers: JSON.stringify({}),
      },
    },
  });

  const logs = await prisma.log.findMany({
    take: 20,
    orderBy: {
      id: 'desc',
    },
  });

  console.log(JSON.stringify(logs));

  return (
    <div className="p-10">
      <p>dashboard</p>
      {session ? <SignOut /> : <SignIn />}
    </div>
  );
}
