import { cn } from '@/lib/utils';
import type { SidebarNavItem } from '@/types';
import { CircleEllipsis, Home, Search } from 'lucide-react';
import Link from 'next/link';

import { WithSidebar } from '@/components/with-sidebar';

const SidebarItem: SidebarNavItem[] = [
  {
    title: 'home',
    href: '#',
    icon: Home,
  },
  {
    title: 'google search',
    href: 'https://google.com',
    icon: Search,
    external: true,
  },
  {
    title: 'more',
    href: '#',
    icon: CircleEllipsis,
  },
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <WithSidebar sidebarContent={SidebarContent} mobileDashboardHeader={SidebarHeader}>
      {children}
    </WithSidebar>
  );
}

const SidebarHeader = () => {
  return (
    <div className="flex">
      <span className="text-2xl font-bold">MS</span>
    </div>
  );
};

const SidebarContent = () => {
  return (
    <div className="h-full relative">
      <SidebarHeader />
      <div className="flex flex-col mt-6">
        {SidebarItem.map((item, index) => (
          <Link
            href={item.href || '#'}
            key={index}
            className={cn(
              'flex items-center p-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-100',
              item.disabled && 'opacity-50 cursor-not-allowed',
              item.external && 'underline',
              item.title === 'more' && 'absolute bottom-0 w-full',
            )}
            target={item.external ? '_blank' : undefined}
          >
            <item.icon className="w-4 h-4" />
            <span className="ml-2">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
