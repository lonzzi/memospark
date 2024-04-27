'use client';

import { register } from '@/lib/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

export default function Page() {
  const [userProvidedPassword, setUserProvidedPassword] = useState('');
  const [isTocAccepted, setIsTocAccepted] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [, registerDispatch] = useFormState(async (...args: Parameters<typeof register>) => {
    const msg = await register(...args);
    if (msg) {
      toast({
        title: 'Error',
        description: msg,
      });
    }
    return msg;
  }, undefined);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserProvidedPassword(event.target.value);
  }

  return (
    <form action={registerDispatch}>
      <div className="h-screen w-screen antialiased bg-background">
        <div className="min-w-fit min-h-fit mx-auto h-1/3 flex flex-col justify-end items-center pb-4">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl pb-12">
            {`Let's create your account`}.
          </h1>
        </div>

        <div className="min-w-fit min-h-fit mx-auto w-1/6 flex flex-col justify-center items-center gap-3">
          <Input type="email" placeholder="Email" name="email" />
          <Input type="password" placeholder="Password" name="password" />
          <Input
            type="password"
            placeholder="Re-enter the password"
            onChange={onChange}
            name="confirmPassword"
            value={userProvidedPassword}
          />
          <div className="flex items-end self-start space-x-2 pl-1 py-2 ">
            <Checkbox
              id="terms"
              checked={isTocAccepted}
              onCheckedChange={() => setIsTocAccepted(!isTocAccepted)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept our{' '}
              <Link href="/toc" className="underline">
                Terms and Conditions
              </Link>
            </label>
          </div>
          <Button className="w-full" type="submit" disabled={!isTocAccepted}>
            <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl || '')}`}>
              Create account
            </Link>
          </Button>
        </div>
      </div>
    </form>
  );
}
