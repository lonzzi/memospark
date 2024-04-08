import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default async function Page({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const session = await auth();
  if (session) {
    if (searchParams.callbackUrl) {
      return redirect(searchParams.callbackUrl);
    } else {
      return redirect('/dashboard');
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <form
        action={async () => {
          'use server';
          try {
            await signIn('signin', {
              username: 'test',
              password: 'test',
              confirmPassword: '',
            });
          } catch (error) {
            if (error instanceof AuthError) {
              if (error.cause?.err?.message === 'Passwords do not match') {
                console.error('Passwords do not match');
              } else {
                throw error;
              }
            }
            return;
          }
        }}
      >
        <Button>Sign In</Button>
      </form>
    </div>
  );
}
