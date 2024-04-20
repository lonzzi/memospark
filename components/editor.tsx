import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Blockquote from '@yoopta/blockquote';
import Callout from '@yoopta/callout';
import Code from '@yoopta/code';
import YooptaEditor, { YooptaPlugin, createYooptaEditor } from '@yoopta/editor';
import type { YooptaContentValue } from '@yoopta/editor/dist/editor/types';
import Embed from '@yoopta/embed';
import File from '@yoopta/file';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import { BulletedList, NumberedList, TodoList } from '@yoopta/lists';
import { Bold, CodeMark, Highlight, Italic, Strike, Underline } from '@yoopta/marks';
import Paragraph from '@yoopta/paragraph';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import Video from '@yoopta/video';
import { useEffect, useMemo, useRef } from 'react';

const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image,
  Video,
  File,
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

type EditorType = {
  value?: YooptaContentValue;
  onChange?: (value: YooptaContentValue) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

function WithBaseFullSetup({ value, onChange, ...props }: EditorType) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  useEffect(() => {
    function handleChange(value: YooptaContentValue) {
      console.log('value', value);
      onChange?.(value);
    }
    editor.on('change', handleChange);
    return () => {
      editor.off('change', handleChange);
    };
  }, [editor, onChange]);

  return (
    <div {...props} ref={selectionRef}>
      <YooptaEditor
        editor={editor}
        plugins={plugins as YooptaPlugin[]}
        tools={TOOLS}
        marks={MARKS}
        selectionBoxRoot={selectionRef}
        value={value}
        autoFocus
      />
    </div>
  );
}

export default WithBaseFullSetup;
