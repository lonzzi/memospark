'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import type { Post } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { z } from 'zod';

export type State<T> = {
  errors?: T;
  message?: string | null;
};

const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.optional(z.string()),
});

const CreatePost = PostSchema.omit({ id: true });
const UpdatePost = PostSchema.partial({ title: true });

type CreatePost = z.infer<typeof CreatePost>;
type UpdatePost = z.infer<typeof UpdatePost>;

export async function createPost(post: CreatePost) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  const validatedFields = CreatePost.safeParse(post);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Post.',
    };
  }

  const { title, content } = validatedFields.data;

  const collection = await prisma.collection.upsert({
    where: { name: 'default' },
    update: {},
    create: {
      name: 'default',
      authorId: userId,
    },
  });

  return await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
      collectionId: collection.id,
    },
  });
}

export async function updatePost(post: UpdatePost) {
  const validatedFields = UpdatePost.safeParse(post);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Post.',
    };
  }

  const { id, title, content } = validatedFields.data;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  const res = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });

  revalidatePath('/posts/[id]', 'page');
  revalidatePath('/', 'page');
  return res;
}

export async function deletePost(id: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }
  const res = await prisma.post.delete({
    where: {
      id,
    },
  });
  revalidatePath('/', 'page');
  return res;
}

export function fetchPosts(options: { id: string }): Promise<Post>;
export function fetchPosts(options?: { offset?: number; limit?: number }): Promise<Post[]>;
export function fetchPosts(options?: {
  collectionId: string;
  offset?: number;
  limit?: number;
}): Promise<Post[]>;
export async function fetchPosts(options?: {
  offset?: number;
  limit?: number;
  id?: string;
  collectionId?: string;
}) {
  noStore();

  const { offset = 0, limit = 10, id } = options || {};
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('User not found');
  }

  if (typeof id === 'string') {
    return await prisma.post.findUnique({
      where: { id: id },
    });
  }

  if (typeof options?.collectionId === 'string') {
    return await prisma.post.findMany({
      where: { collectionId: options.collectionId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });
  }

  return await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: limit,
  });
}
