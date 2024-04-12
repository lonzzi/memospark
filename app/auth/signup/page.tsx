import LoginForm from '@/app/ui/login-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const session = await auth();
  if (session) {
    if (searchParams.callbackUrl) {
      return redirect(searchParams.callbackUrl);
    } else {
      return redirect('/dashboard');
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <LoginForm type="signup" />
    </div>
  );
}
