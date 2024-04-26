'use client';

import { lusitana } from '@/app/ui/fonts';
import { authenticate, authenticateWithGithub, register } from '@/lib/actions';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

type LoginFormProps = {
  type?: 'login' | 'signup';
};

export default function LoginForm({ type = 'login' }: LoginFormProps) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [, loginDispatch] = useFormState(async (...args: Parameters<typeof authenticate>) => {
    const msg = await authenticate(...args);
    if (msg) {
      toast.error(msg);
    }
    return msg;
  }, undefined);

  const [, registerDispatch] = useFormState(async (...args: Parameters<typeof register>) => {
    const msg = await register(...args);
    if (msg) {
      toast.error(msg);
    }
    return msg;
  }, undefined);

  return (
    <div className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <form action={type === 'login' ? loginDispatch : registerDispatch}>
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please {type === 'login' ? 'log in' : 'sign up'} to continue.
          </h1>
          <div className="w-full">
            <div>
              <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                />
              </div>
            </div>
            {type === 'signup' && (
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="confirmPassword"
                >
                  ConfirmPassword
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter password"
                  />
                </div>
              </div>
            )}
          </div>
          <LoginButton type={type} />
          <div className="my-2 text-sm">
            {type === 'login' && (
              <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl || '')}`}>
                Don&apos;t have an account? Sign up
              </Link>
            )}
            {type === 'signup' && (
              <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl || '')}`}>
                Have an account? Log in
              </Link>
            )}
          </div>
          <div className="border-b mb-2 pb-2 relative">
            <span className="absolute bg-gray-50 -top-1/2 left-1/2 -translate-x-1/2">or</span>
          </div>
        </form>
        <form action={authenticateWithGithub}>
          <OauthButton provider="github" />
        </form>
      </div>
    </div>
  );
}

function LoginButton({ type }: { type: 'login' | 'signup' }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" disabled={pending}>
      {type === 'login' ? 'Log in' : 'Sign up'}
    </Button>
  );
}

function OauthButton({ provider }: { provider: 'github' }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" disabled={pending}>
      {provider === 'github' ? <GitHubLogoIcon className="w-5 h-5 mr-2" /> : ''}
      {provider === 'github' ? 'Sign in with GitHub' : 'Sign in with Google'}
    </Button>
  );
}
