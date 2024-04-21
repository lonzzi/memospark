import { fetchPosts } from '@/lib/data';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';

import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';

dayjs.extend(utc);
dayjs.extend(timezone);

export const RecentPosts = async () => {
  const posts = await fetchPosts();

  return (
    <Table>
      <TableCaption>A list of your recent posts.</TableCaption>
      <TableBody>
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id} legacyBehavior>
            <TableRow className="cursor-pointer">
              <TableCell className="font-medium py-5 w-8/12">{post.title}</TableCell>
              <TableCell className="py-5">
                {dayjs(post.updatedAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm')}
              </TableCell>
              <TableCell className="py-5">
                {dayjs(post.createdAt).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm')}
              </TableCell>
            </TableRow>
          </Link>
        ))}
      </TableBody>
    </Table>
  );
};
