'use client';

import { EDITOR_BASIC_INIT_VALUE } from '@/lib/mock';
import { type YooptaContentValue } from '@yoopta/editor/dist/editor/types';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const [value, setValue] = useState<YooptaContentValue | undefined>(
    params.id === 'example' ? EDITOR_BASIC_INIT_VALUE : undefined,
  );

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Editor value={value} onChange={setValue} />
      </Suspense>
    </div>
  );
}
