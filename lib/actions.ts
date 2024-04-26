'use server';

import prisma from './prisma';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type State<T> = {
  errors?: T;
  message?: string | null;
};

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('login', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      const causedError = error.cause?.err;
      if (causedError) {
        return causedError.message;
      }
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('signup', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      const causedError = error.cause?.err;
      if (causedError) {
        return causedError.message;
      }
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function authenticateWithGithub() {
  await signIn('github');
}

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
  revalidatePath('/posts/[id]', 'page');
  const validatedFields = UpdatePost.safeParse(post);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Post.',
    };
  }

  const { id, title, content } = validatedFields.data;

  return await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });
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
