'use client';

import { register } from '@/actions/auth';
import { useActionState } from '@/hooks';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export default function Page() {
  const [userProvidedPassword, setUserProvidedPassword] = useState('');
  const [isTocAccepted, setIsTocAccepted] = useState(false);
  const [error, submitAction, isPending] = useActionState(register, undefined);

  useEffect(() => {
    if (error && !isPending) {
      toast.error(error);
    }
  }, [error, isPending]);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserProvidedPassword(event.target.value);
  }

  return (
    <form action={submitAction}>
      <div className="h-screen w-screen antialiased bg-background">
        <div className="min-w-fit min-h-fit mx-auto h-1/3 flex flex-col justify-end items-center pb-4">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl pb-12">
            {`Let's create your account`}.
          </h1>
        </div>

        <div className="min-w-fit min-h-fit mx-auto w-1/6 flex flex-col justify-center items-center gap-3">
          <Input type="email" placeholder="邮箱" name="email" />
          <Input type="password" placeholder="密码" name="password" />
          <Input
            type="password"
            placeholder="重新输入你的密码"
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
              同意{' '}
              <Link href="/toc" className="underline">
                我们的政策
              </Link>
            </label>
          </div>
          <Button className="w-full" type="submit" disabled={!isTocAccepted || isPending}>
            创建账号
          </Button>
        </div>
      </div>
    </form>
  );
}
