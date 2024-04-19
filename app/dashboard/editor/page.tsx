'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Editor = dynamic(() => import('@/components/editor').then((mod) => mod.Editor), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Editor />
      </Suspense>
    </div>
  );
}
