'use client';

import { editorAtom } from '@/atoms/editor';
import { timeAgo } from '@/lib/utils';
import type { Post } from '@prisma/client';
import { useDebounce } from '@uidotdev/usehooks';
import { useAtom } from 'jotai';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AutoHeightTextarea } from '@/components/ui/textarea';

type EditorWrapperProps = PropsWithChildren<{
  post?: Post | null;
  onValueChange?: (post: Partial<Post>) => void;
}>;

export const EditorWrapper: React.FC<EditorWrapperProps> = ({ post, onValueChange, children }) => {
  const [editorState, setEditorState] = useAtom(editorAtom);
  const [title, setTitle] = useState(post ? post.title : 'example');
  const debouncedTitle = useDebounce(title, 500);
  const postId = useRef(post?.id);
  const handleChange = useRef(onValueChange);

  useEffect(() => {
    if (!postId.current) return;

    handleChange.current?.({ title: debouncedTitle });
  }, [debouncedTitle]);

  useEffect(() => {
    if (!post) return;
    setEditorState((status) => {
      status.post = post;
    });
  }, [post, setEditorState]);

  return (
    <div className="flex flex-col h-full">
      <div className="absolute w-full top-0 left-0 p-2 flex justify-between items-center text-sm">
        <Popover>
          <PopoverTrigger asChild className="max-w-96 line-clamp-1 text-ellipsis break-all">
            <Button variant="ghost">{title}</Button>
          </PopoverTrigger>
          <PopoverContent className="px-2 py-1 w-96">
            <AutoHeightTextarea
              className="focus-visible:ring-0"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.textContent || '');
              }}
            />
          </PopoverContent>
        </Popover>
        <span className="text-gray-500 px-4 py-2">
          {editorState.lastSavedAt
            ? `Edited ${timeAgo(editorState.lastSavedAt)}`
            : editorState.status}
        </span>
      </div>
      <div className="flex-auto mt-10 md:mt-20 md:mx-40">{children}</div>
    </div>
  );
};
