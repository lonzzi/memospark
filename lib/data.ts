'use server';

import prisma from './prisma';
import { auth } from '@/auth';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchUserByEmail(email: string) {
  noStore();

  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function fetchPostById(id: string) {
  noStore();

  const res = await prisma.post.findUnique({
    where: { id },
  });

  return res;
}

export async function fetchPosts() {
  noStore();

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  return await prisma.post.findMany({
    where: { authorId: userId },
  });
}
