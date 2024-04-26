import { DashboardNavigationMenu } from '@/app/ui/dashboard/navigation-menu';
import { Suspense } from 'react';

import { RecentPosts } from '../ui/dashboard/post-list';
import { PostListSkeleton } from '../ui/post/skeletons';

export default async function Dashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-medium mb-6">Start</h2>
        <div className="text-xs text-gray-800">
          <DashboardNavigationMenu />
        </div>
      </section>
      <section>
        <h2 className="text-lg font-medium mb-6">Recently</h2>
        <Suspense fallback={<PostListSkeleton />}>
          <RecentPosts />
        </Suspense>
      </section>
    </div>
  );
}
