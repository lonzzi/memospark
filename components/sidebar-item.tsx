'use client';

import { deleteCollection, updateCollection } from '@/actions/collection';
import { fetchPosts } from '@/actions/post';
import { useCommand } from '@/app/ui/global-command';
import { currentPostAtom } from '@/atoms/post';
import { cn } from '@/lib/utils';
import type { SidebarNavItem } from '@/types';
import type { Post } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { useAtomValue } from 'jotai';
import { ChevronUp, Ellipsis, Home, NotebookText, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const SidebarItems: SidebarNavItem[] = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
];

const CollectionItem = ({ item, className }: { item: SidebarNavItem; className?: string }) => {
  if ('type' in item) throw new Error('Invalid item type');

  const currentPost = useAtomValue(currentPostAtom);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionName, setCollectionName] = useState(item?.title || '');

  useEffect(() => {
    (async () => {
      console.log('title', currentPost);
      if (item.id) {
        const res = await fetchPosts({
          collectionId: item.id,
        });
        setPosts(res);
        setLoading(false);
        console.log(res);
      }
    })();
  }, [currentPost, item.id]);

  return (
    <div
      className={cn(
        'flex flex-col text-sm font-medium text-gray-500 cursor-pointer transition-all',
        className,
      )}
    >
      <div
        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 group"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <div className="flex space-x-1 items-center">
          <ChevronUp className={cn('w-4 h-4 transition-all', open && 'rotate-180')} />
          {item.icon ? <item.icon className="w-4 h-4" /> : <NotebookText className="w-4 h-4" />}
          <span className="max-w-[96px] text-ellipsis overflow-hidden">{item.title}</span>
        </div>
        <div
          className="opacity-0 group-hover:opacity-100 flex space-x-1"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Ellipsis className="w-5 h-5 p-0.5 rounded-md hover:bg-gray-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit collection</DialogTitle>
              </DialogHeader>
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Collection name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={async () => {
                    await updateCollection({
                      id: item.id,
                      name: collectionName,
                    });
                    setIsEditDialogOpen(false);
                    toast.success('Collection updated');
                  }}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete collection</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this collection?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={async () => {
                    if (!item.id) {
                      setIsDeleteDialogOpen(false);
                      toast.error('Collection not found');
                      return;
                    }
                    await deleteCollection(item.id);
                    setIsDeleteDialogOpen(false);
                    toast.success('Collection deleted');
                  }}
                >
                  Confirm
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Plus className="w-5 h-5 p-0.5 rounded-md hover:bg-gray-200" />
        </div>
      </div>
      <div>
        {open &&
          (loading ? (
            <div className="ml-7 p-2 text-gray-500">Loading...</div>
          ) : (
            <div className="ml-7">
              {posts.map((post, index) => (
                <Link
                  key={index}
                  href={`/post/${post.id}`}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100"
                >
                  <span>{currentPost?.id === post.id ? currentPost.title : post.title}</span>
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

const SidebarItemList = ({ items }: { items: SidebarNavItem[] }) => {
  const { setOpen } = useCommand();

  return (
    <>
      <div
        className="flex items-center p-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Search className="w-5 h-5" />
        <span className="ml-2">搜索</span>
      </div>
      {[...SidebarItems, ...items]?.map((item, index) =>
        'type' in item ? (
          item.type === 'separator' && <div key={index} className="my-6" />
        ) : item.href ? (
          <Link
            key={index}
            href={item.href || '#'}
            className={cn(
              'flex items-center p-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-100',
              item.disabled && 'opacity-50 cursor-not-allowed',
              item.external && 'underline',
            )}
            target={item.external ? '_blank' : undefined}
          >
            {item.icon ? <item.icon className="w-5 h-5" /> : <NotebookText className="w-5 h-5" />}
            <span className="ml-2">{item.title}</span>
          </Link>
        ) : (
          <CollectionItem key={index} item={item} />
        ),
      )}
    </>
  );
};

export default SidebarItemList;
