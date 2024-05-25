'use client';

import { authenticate, authenticateWithGithub } from '@/actions/auth';
import { useActionState } from '@/hooks';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useEffect, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Page() {
  const [error, submitAction, isPending] = useActionState(authenticate, undefined);
  const [isGithubPending, startGithubTransition] = useTransition();

  useEffect(() => {
    if (error && !isPending) {
      toast.error(error);
    }
  }, [error, isPending]);

  return (
    <div className="h-screen w-screen antialiased bg-background">
      <div className="min-w-fit min-h-fit w-1/6 h-2/3 mx-auto flex flex-col justify-center items-center gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl pb-6">登录</h1>
        <form action={submitAction} className="w-full space-y-2">
          <Input type="email" placeholder="邮箱" name="email" />
          <Input type="password" placeholder="密码" className="mb-1" name="password" />
          <Button className="w-full" type="submit" disabled={isPending || isGithubPending}>
            登录
          </Button>
        </form>
        <form
          action={async () => {
            startGithubTransition(async () => {
              await authenticateWithGithub();
            });
          }}
          className="w-full"
        >
          <Button className="w-full" disabled={isPending || isGithubPending} variant={'outline'}>
            <GitHubLogoIcon className="w-4 h-4 mr-2" />
            使用 GitHub 登录
          </Button>
        </form>
        <div className="flex items-center justify-center w-full h-4 flex-none">
          <div className="w-full h-[1px] visible border-b my--4 py--4" />
          <p className="bg-background p-2 font-normal text-xs uppercase text-muted-foreground absolute">
            or
          </p>
        </div>
        <Button className="w-full" variant="outline" asChild>
          <Link href={'/signup'}>创建账号</Link>
        </Button>
        <Button variant={'link'} className="text-muted-foreground font-normal h-fit" asChild>
          <Link href={'/account-recovery'}>登录遇到了问题?</Link>
        </Button>
      </div>
    </div>
  );
}
