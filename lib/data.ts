'use server';

import prisma from './prisma';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchUserByEmail(email: string) {
  noStore();

  return await prisma.user.findUnique({
    where: { email },
  });
}
