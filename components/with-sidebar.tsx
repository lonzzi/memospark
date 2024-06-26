// sidebar component from https://gist.github.com/sturmenta/2dc2006ee17a8529fc63535b82626721
import SidebarItemList from './sidebar-item';
import { fetchCollections } from '@/actions/collection';
import { signOut } from '@/auth';
import { cn } from '@/lib/utils';
import type { SidebarNavItem } from '@/types';
import { CircleEllipsis, CircleUserRound, LogOut, MenuIcon, Settings } from 'lucide-react';
import type { Session } from 'next-auth';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const UserAvatar = ({ className, user }: { className?: string; user: Session['user'] }) => {
  return (
    <Avatar className={cn('cursor-pointer hidden md:flex w-8 h-8', className)}>
      <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
    </Avatar>
  );
};

const SidebarHeader = ({ user }: { user: Session['user'] }) => {
  return (
    <div className="flex select-none justify-between items-center">
      <span className="text-xl font-bold">MS</span>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <UserAvatar user={user} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="px-4 py-3 min-w-56 font-medium text-gray-500"
          >
            <DropdownMenuLabel className="flex items-center">
              <UserAvatar user={user} className="cursor-default" />
              <span className="ml-2">{user.name}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <CircleUserRound className="w-5 h-5" />
              <span className="ml-2">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/setting" className="flex w-full">
                <Settings className="w-5 h-5" />
                <span className="ml-2">Setting</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
                className="w-full"
              >
                <button className="w-full flex items-center text-left" type="submit">
                  <LogOut className="w-5 h-5" />
                  <span className="ml-2">Sign Out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

const SidebarContent = ({ items, user }: { items?: SidebarNavItem[]; user?: Session['user'] }) => {
  return (
    <div className="h-full relative">
      <SidebarHeader user={user} />
      <div className="flex flex-col mt-6">
        <SidebarItemList items={items || []} />
        <div className="flex items-center p-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-100 absolute bottom-0 w-full cursor-pointer select-none">
          <CircleEllipsis className="w-4 h-4" />
          <span className="ml-2">more</span>
        </div>
      </div>
    </div>
  );
};

export const WithMobileSidebar = ({
  children,
  items,
  user,
  mobileDashboardHeader: MobileDashboardHeader,
}: {
  children: React.ReactNode;
  items?: SidebarNavItem[];
  user?: Session['user'];
  mobileDashboardHeader?: () => JSX.Element;
}) => {
  return (
    <>
      <Sheet>
        <div className="mt-5 flex md:hidden">
          <div className="flex flex-1">{MobileDashboardHeader && <MobileDashboardHeader />}</div>
          <SheetTrigger>
            <MenuIcon size={24} />
          </SheetTrigger>
        </div>
        <SheetContent side="left">
          <SidebarContent user={user} items={items} />
        </SheetContent>
      </Sheet>
      {children}
    </>
  );
};

const WithDesktopSidebar = ({
  children,
  items,
  user,
}: {
  children: React.ReactNode;
  items?: SidebarNavItem[];
  user?: Session['user'];
}) => {
  return (
    // style used from here -> https://github.com/shadcn-ui/ui/blob/1cf5fad881b1da8f96923b7ad81d22d0aa3574b9/apps/www/app/docs/layout.tsx#L12
    <div className="px-8 md:px-0 h-screen flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] md:overflow-auto">
      <aside className="fixed top-14 z-30 md:z-auto hidden h-screen w-full shrink-0 border-r md:sticky md:top-0 md:block bg-nav-primary">
        <div className="h-full p-4">
          <SidebarContent user={user} items={items} />
        </div>
      </aside>
      {children}
    </div>
  );
};

export const WithSidebar = async ({
  children,
  user,
  ...props
}: {
  children: React.ReactNode;
  user?: Session['user'];
}) => {
  const res = await fetchCollections();
  const items: SidebarNavItem[] = [
    { type: 'separator' },
    ...res.map((item) => ({
      title: item.name,
      items: [],
      id: item.id,
    })),
  ];

  return (
    <WithDesktopSidebar user={user} items={items} {...props}>
      <WithMobileSidebar user={user} items={items} {...props}>
        {children}
      </WithMobileSidebar>
    </WithDesktopSidebar>
  );
};
