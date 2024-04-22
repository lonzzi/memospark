import { EditorWrapper } from '@/app/ui/post/editor-wrapper';
import { updatePost } from '@/lib/actions';
import { fetchPostById } from '@/lib/data';
import { EDITOR_BASIC_INIT_VALUE } from '@/lib/mock';
import type { Post } from '@prisma/client';
import { type YooptaContentValue } from '@yoopta/editor/dist/editor/types';
import dynamicImport from 'next/dynamic';

const Editor = dynamicImport(() => import('@/components/editor'), {
  ssr: false,
});

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  let value: YooptaContentValue | undefined =
    params.id === 'example' ? EDITOR_BASIC_INIT_VALUE : undefined;

  let post: Post | null;
  if (params.id !== 'example') {
    post = await fetchPostById(params.id);
    if (post) {
      try {
        if (post.content) {
          value = JSON.parse(post.content);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <EditorWrapper>
      <Editor
        value={value}
        delay={1000}
        onChange={async (value) => {
          'use server';
          if (!params.id || params.id === 'example') return;
          await updatePost({
            id: params.id,
            title: 'New Post',
            content: JSON.stringify(value),
          });
        }}
      />
    </EditorWrapper>
  );
}
