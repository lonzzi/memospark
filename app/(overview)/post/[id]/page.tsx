import { fetchPosts, updatePost } from '@/actions/post';
import { EditorWrapper } from '@/app/ui/post/editor-wrapper';
import { EditorSkeleton } from '@/app/ui/post/skeletons';
import { DEFAULT_POST_TITLE } from '@/lib/const';
import type { Post } from '@prisma/client';
import dynamic from 'next/dynamic';
import type { JSONContent } from 'novel';

const Editor = dynamic(() => import('@/components/editor/advanced-editor'), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  let post: Post | null = null;
  if (params.id !== 'example') {
    post = await fetchPosts({ id: params.id });
  }

  return {
    title: post?.title || DEFAULT_POST_TITLE,
  };
}

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  let value: JSONContent | undefined = undefined;

  const post: Post | null = await fetchPosts({ id: params.id });
  try {
    value = post?.content && JSON.parse(post?.content);
  } catch (e) {
    console.error('Error parsing JSON', e);
  }

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
      <Editor
        value={value}
        onUpdate={async (value) => {
          'use server';
          return await handleSave({ content: value });
        }}
      />
    </EditorWrapper>
  );
}
