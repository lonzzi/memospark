import { auth } from '@/auth';

import { SignIn, SignOut } from '@/components/auth-components';

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="p-10">
      <p>dashboard</p>
      {session ? <SignOut /> : <SignIn />}
    </div>
  );
}
