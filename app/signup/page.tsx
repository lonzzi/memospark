import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';

import { Loading } from '@/components/loading';

export default async function Page() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Suspense fallback={<Loading />}>
        <LoginForm type="signup" />
      </Suspense>
    </div>
  );
}
