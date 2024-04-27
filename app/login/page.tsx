'use client';

import { authenticate, authenticateWithGithub } from '@/actions/auth';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Page() {
  const [, loginDispatch] = useFormState(async (...args: Parameters<typeof authenticate>) => {
    const msg = await authenticate(...args);
    if (msg) {
      toast.error(msg);
    }
    return msg;
  }, undefined);

  return (
    <div className="h-screen w-screen antialiased bg-background">
      <div className="min-w-fit min-h-fit w-1/6 h-2/3 mx-auto flex flex-col justify-center items-center gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl pb-6">Sign in</h1>
        <form action={loginDispatch} className="w-full space-y-2">
          <Input type="email" placeholder="Email" name="email" />
          <Input type="password" placeholder="Password" className="mb-1" name="password" />
          <LoginButton />
        </form>
        <form action={authenticateWithGithub} className="w-full">
          <OauthButton provider="github" />
        </form>
        <div className="flex items-center justify-center w-full h-4 flex-none">
          <div className="w-full h-[1px] visible border-b my--4 py--4" />
          <p className="bg-background p-2 font-normal text-xs uppercase text-muted-foreground absolute">
            or
          </p>
        </div>
        <Button className="w-full" variant="outline" asChild>
          <Link href={'/signup'}>Create an Account</Link>
        </Button>
        <Button variant={'link'} className="text-muted-foreground font-normal h-fit" asChild>
          <Link href={'/account-recovery'}>Having trouble signing in?</Link>
        </Button>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      Sign in
    </Button>
  );
}

function OauthButton({ provider }: { provider: 'github' }) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} variant={'outline'}>
      {provider === 'github' ? <GitHubLogoIcon className="w-4 h-4 mr-2" /> : ''}
      {provider === 'github' ? 'Continue with GitHub' : 'Continue with Google'}
    </Button>
  );
}
