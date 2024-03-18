import { auth } from '@/auth';

import { SignIn, SignOut } from '@/components/auth-components';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="p-10">
      <p>dashboard</p>
      {session ? <SignOut /> : <SignIn />}
      {session && (
        <div className="flex items-center space-x-2">
          <p>user: {session?.user?.name}</p>
          <p>email: {session?.user?.email}</p>
          <Avatar>
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
            <AvatarFallback>{session?.user?.name}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
