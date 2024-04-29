'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import type { Collection } from '@prisma/client';

export async function createCollection(title: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  if (!title) {
    return {
      errors: {
        title: 'Title is required',
      },
      message: 'Title is required',
    };
  }

  return await prisma.collection.create({
    data: {
      authorId: userId,
      name: title,
    },
  });
}

export async function updateCollection(
  collection: Partial<Pick<Collection, 'id' | 'name' | 'description'>>,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  const res = await prisma.collection.update({
    where: {
      id: collection.id,
    },
    data: {
      ...collection,
    },
  });

  return res;
}

export async function deleteCollection(id: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  return await prisma.collection.delete({
    where: {
      id,
    },
  });
}

export function fetchCollections(id: string): Promise<Collection>;
export function fetchCollections(options: {
  offset?: number;
  limit?: number;
}): Promise<Collection[]>;
export async function fetchCollections(params: string | { offset?: number; limit?: number }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  if (typeof params === 'string') {
    return await prisma.collection.findUnique({
      where: {
        id: params,
      },
    });
  }

  const { offset = 0, limit = 10 } = params;

  return await prisma.collection.findMany({
    where: {
      authorId: userId,
    },
    skip: offset,
    take: limit,
  });
}
