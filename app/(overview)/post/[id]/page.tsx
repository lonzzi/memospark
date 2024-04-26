import { EditorWrapper } from '@/app/ui/post/editor-wrapper';
import { EditorSkeleton } from '@/app/ui/post/skeletons';
import { updatePost } from '@/lib/actions';
import { fetchPostById } from '@/lib/data';
import type { Post } from '@prisma/client';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/editor/advanced-editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  let post: Post | null = null;
  if (params.id !== 'example') {
    post = await fetchPostById(params.id);
  }

  return {
    title: post?.title || 'New Post',
  };
}

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  // let value: YooptaContentValue | undefined =
  //   params.id === 'example' ? EDITOR_BASIC_INIT_VALUE : undefined;

  const post: Post | null = null;

  const handleSave = async (post: Partial<Post>) => {
    'use server';
    if (!params.id || params.id === 'example') return;
    return await updatePost({
      id: params.id,
      ...post,
      content: post.content || undefined,
    });
  };

  return (
    <EditorWrapper post={post} onValueChange={handleSave}>
      <Editor />
    </EditorWrapper>
  );
}
