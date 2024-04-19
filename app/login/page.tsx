import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

export default async function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
