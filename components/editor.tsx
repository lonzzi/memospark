import { cn } from '@/lib/utils';
import CheckList from '@editorjs/checklist';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import EditorJS, { type EditorConfig, type OutputData } from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import { type PropsWithChildren, useEffect, useRef } from 'react';

type EditorProps = PropsWithChildren<{
  holder?: string;
  data?: OutputData;
  onDataChange?: (data: OutputData) => void;
  config?: EditorConfig;
  maxWidth?: string | number;
}> &
  React.HTMLAttributes<HTMLDivElement>;

export const Editor: React.FC<EditorProps> = ({
  holder,
  data,
  onDataChange,
  config = {},
  maxWidth = 1000,
  children,
  ...props
}) => {
  const editor = useRef<EditorJS | null>(null);
  const maxW = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS({
        ...config,
        holder,
        data,
        tools: {
          code: Code,
          header: Header,
          paragraph: Paragraph,
          checklist: CheckList,
          embed: Embed,
          image: Image,
          inlineCode: InlineCode,
          link: Link,
          list: List,
          quote: Quote,
          simpleImage: SimpleImage,
          delimiter: Delimiter,
        },
        async onChange(api) {
          const data = await api.saver.save();
          onDataChange?.(data);
        },
      });
    }

    return () => {
      if (editor.current && editor.current.destroy) {
        editor.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      {...props}
      id={holder || 'editorjs'}
      className={cn(
        'prose max-w-full',
        `[&_.ce-block\\_\\_content]:max-w-[${maxW}] [&_.ce-toolbar\\_\\_content]:max-w-[${maxW}]`,
        props.className,
      )}
    >
      {children}
    </div>
  );
};
