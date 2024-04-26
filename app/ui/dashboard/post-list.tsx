import { RecentPostsClient } from './post-list.client';
import { fetchPosts } from '@/lib/data';

export const RecentPosts = async () => {
  const posts = await fetchPosts();

  return <RecentPostsClient posts={posts} />;
};
