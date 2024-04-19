'use client';

import type { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

const Editor = dynamic(() => import('@/components/editor').then((mod) => mod.Editor), {
  ssr: false,
});

export default function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  console.log(params);
  const [data, setData] = useState<OutputData>();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Editor
          config={{
            autofocus: true,
            placeholder: 'Let`s write an awesome story!',
          }}
          data={data}
          onDataChange={setData}
        />
      </Suspense>
    </div>
  );
}
