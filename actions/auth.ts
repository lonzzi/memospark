'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

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
