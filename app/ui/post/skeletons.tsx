import { Skeleton } from '@/components/ui/skeleton';

export const PostListSkeleton: React.FC = () => {
  return (
    <div className="mt-4 flex flex-col h-full space-y-2">
      <div className="flex items-center py-5">
        <Skeleton className="w-1/2 h-5" />
      </div>
      <div className="flex items-center py-5">
        <Skeleton className="w-1/2 h-5" />
      </div>
      <div className="flex items-center py-5">
        <Skeleton className="w-1/2 h-5" />
      </div>
    </div>
  );
};

export const EditorSkeleton: React.FC = () => {
  return (
    <div className="mt-4 flex flex-col h-full space-y-2">
      <Skeleton className="w-1/2 h-6" />
      <Skeleton className="h-10" />
    </div>
  );
};
