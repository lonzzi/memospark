'use client';

import { DEFAULT_POST_TITLE } from '@/lib/const';
import { timeAgo } from '@/lib/utils';
import type { Post } from '@prisma/client';
import { useDebounce } from '@uidotdev/usehooks';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';

import { useEditorAtom } from '@/atoms/hooks/editor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AutoHeightTextarea } from '@/components/ui/textarea';

type EditorWrapperProps = PropsWithChildren<{
  post?: Post | null;
  onValueChange?: (post: Partial<Post>) => void;
}>;

export const EditorWrapper: React.FC<EditorWrapperProps> = ({ post, onValueChange, children }) => {
  const [editorState, setEditorState] = useEditorAtom();
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
            <Button variant="ghost">{title || DEFAULT_POST_TITLE}</Button>
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
          {editorState.status === 'saving'
            ? editorState.status
            : editorState.lastSavedAt
              ? `Edited ${timeAgo(editorState.lastSavedAt)}`
              : editorState.status}
        </span>
      </div>
      <div className="flex-auto mt-10 md:mt-40 md:mx-40 relative">
        {children}
        <Input
          className="absolute -top-5 py-0 px-8 sm:px-12 focus-visible:ring-0 border-none shadow-none text-5xl font-bold h-auto"
          placeholder={DEFAULT_POST_TITLE}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            document.title = e.target.value || DEFAULT_POST_TITLE;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              editorState.editor?.commands.setTextSelection(0);
              editorState.editor?.commands.enter();
              editorState.editor?.commands.focus('start');
            }
          }}
        />
      </div>
    </div>
  );
};
