import { Suspense } from 'react';

import { MDXEditor } from '@/components/mdx-editor';

const markdown = `
# Hello world!
`;

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MDXEditor markdown={markdown} placeholder="Start..." />
      </Suspense>
    </div>
  );
}
