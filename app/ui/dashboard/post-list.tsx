import { RecentPostsClient } from './post-list.client';
import { fetchPosts } from '@/actions/post';

export const RecentPosts = async () => {
  const posts = await fetchPosts();

  return <RecentPostsClient posts={posts} />;
};
