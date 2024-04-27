'use client';

import { createPost } from '@/actions/post';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export const DashboardNavigationMenu = () => {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-4">
        {/* <NavigationMenuItem>
          <NavigationMenuTrigger className="p-6 border border-input shadow-sm">
            New Page
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col p-2 w-[200px]">
              <ListItem
                title="fetchUser"
                onClick={async () => {
                  const email = session?.data?.user?.email;
                  console.log(session);
                  if (!email) return;
                  const res = await fetchUserByEmail(email);
                  console.log('res', res);
                }}
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
        <NavigationMenuItem>
          <button
            className={cn(navigationMenuTriggerStyle(), 'p-6 border border-input shadow-sm')}
            onClick={async () => {
              setCreating(true);
              const res = await createPost({
                title: 'New Post',
              });
              if ('errors' in res) {
                // Handle error response
                console.error(res.message);
                setCreating(false);
              } else {
                const postId = res.id;
                router.push(`/post/${postId}`);
              }
            }}
            disabled={creating}
          >
            New Post
          </button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <button className={cn(navigationMenuTriggerStyle(), 'p-6 border border-input shadow-sm')}>
            New Collection
          </button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={props.href || '#'}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
