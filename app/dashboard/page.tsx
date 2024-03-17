import { auth } from '@/auth';

import { SignIn, SignOut } from '@/components/auth-components';

export default async function Dashboard() {
  const session = await auth();
  console.log('session', session);

  return (
    <div className="p-10">
      <p>dashboard</p>
      {session ? <SignOut /> : <SignIn />}
    </div>
  );
}

export const runtime = 'edge';
