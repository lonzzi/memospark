'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
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

  const validatedFields = CreatePost.safeParse(post);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Post.',
    };
  }

  const { title, content } = validatedFields.data;

  return await prisma.post.create({
    data: {
      authorId: userId,
      title,
      content,
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
  return res;
}

export async function deletePost(id: string) {
  const res = await prisma.post.delete({
    where: {
      id,
    },
  });
  revalidatePath('/', 'page');
  return res;
}