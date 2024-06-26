'use client';

import { deletePost } from '@/actions/post';
import dayjs from '@/lib/dayjs';
import type { Post } from '@prisma/client';
import { Ellipsis, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';

export const RecentPostsClient = ({ posts }: { posts: Post[] }) => {
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setIsPending(false);
  }, [posts]);

  return (
    <Table>
      <TableCaption>
        {posts.length > 0 ? 'A list of your recent posts.' : 'You have no posts yet.'}
      </TableCaption>
      <TableBody>
        {posts.slice(0, 10).map((post) => (
          <TableRow key={post.id} className="group">
            <TableCell className="font-medium py-5 w-8/12">
              <Link href={`/post/${post.id}`} legacyBehavior>
                <span className="cursor-pointer">{post.title}</span>
              </Link>
            </TableCell>
            <TableCell className="py-5">
              {dayjs(post.updatedAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm')}
            </TableCell>
            <TableCell className="py-5">
              {dayjs(post.createdAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm')}
            </TableCell>
            <TableCell className="py-5 text-gray-500">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Ellipsis className="w-4 h-4 cursor-pointer text-gray-500 invisible group-hover:visible" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full"
                      type="submit"
                      disabled={isPending}
                      onClick={async () => {
                        setIsPending(true);
                        await deletePost(post.id);
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
