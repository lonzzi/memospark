import { auth } from '@/auth';

import { WithSidebar } from '@/components/with-sidebar';

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <WithSidebar user={session?.user}>
      <div className="p-10">{children}</div>
    </WithSidebar>
  );
}
