'use client';

import { createCollection } from '@/actions/collection';
import { createPost } from '@/actions/post';
import { DEFAULT_POST_TITLE } from '@/lib/const';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <NavigationMenu>
      <NavigationMenuList className="space-x-4">
        <NavigationMenuItem>
          <button
            className={cn(navigationMenuTriggerStyle(), 'p-6 border border-input shadow-sm')}
            onClick={async () => {
              setCreating(true);
              const res = await createPost({
                title: DEFAULT_POST_TITLE,
              });
              if ('errors' in res) {
                // Handle error response
                toast.error(res.message);
                setCreating(false);
              } else {
                const postId = res.id;
                router.push(`/post/${postId}`);
              }
            }}
            disabled={creating}
          >
            新建文章
          </button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                className={cn(navigationMenuTriggerStyle(), 'p-6 border border-input shadow-sm')}
              >
                新建知识库
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Collection</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={async () => {
                    const res = await createCollection(title);
                    if ('errors' in res) {
                      // Handle error response
                      toast.error(res.message);
                    } else {
                      setOpen(false);
                      toast.success('Collection created');
                    }
                  }}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
