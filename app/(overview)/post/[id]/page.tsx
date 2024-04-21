import { updatePost } from '@/lib/actions';
import { fetchPostById } from '@/lib/data';
import { EDITOR_BASIC_INIT_VALUE } from '@/lib/mock';
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

  if (params.id !== 'example') {
    const content = (await fetchPostById(params.id))?.content;
    if (content) {
      try {
        value = JSON.parse(content) as YooptaContentValue;
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div>
      <Editor
        value={value}
        timeout={1000}
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
    </div>
  );
}
