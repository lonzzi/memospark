import EditorJS, { type EditorConfig, type OutputData } from '@editorjs/editorjs';
import { type PropsWithChildren, useEffect, useRef } from 'react';

type EditorProps = PropsWithChildren<{
  holder?: string | HTMLElement;
  data?: OutputData;
  config?: EditorConfig;
}> &
  JSX.IntrinsicElements['div'];

export const Editor: React.FC<EditorProps> = ({
  holder,
  data,
  config = {},
  children,
  ...props
}) => {
  const editor = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS({
        ...config,
        holder,
        data,
      });
    }

    return () => {
      if (editor.current && editor.current.destroy) {
        editor.current.destroy();
      }
    };
  }, [config, data, holder]);

  return (
    <div {...props} id={typeof holder === 'string' ? holder : 'editorjs'}>
      {children}
    </div>
  );
};
