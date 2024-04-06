'use client';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  type CodeBlockEditorDescriptor,
  ConditionalContents,
  InsertCodeBlock,
  InsertSandpack,
  ListsToggle,
  type MDXEditorMethods,
  type MDXEditorProps,
  MDXEditor as OriginMDXEditor,
  type SandpackConfig,
  ShowSandpackInfo,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  useCodeBlockEditorContext,
} from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import type { CSSProperties, ForwardedRef } from 'react';
import { forwardRef, useEffect, useRef } from 'react';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  match: () => true,
  priority: 0,
  Editor: (props) => {
    const textareaStyle: CSSProperties = {
      fontFamily: 'monospace',
      fontSize: '14px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      width: '100%',
      minHeight: '14px',
      height: 'auto',
      backgroundColor: '#f4f4f4',
      resize: 'vertical',
      outline: 'none',
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
      const currentTextarea = textareaRef.current;
      // Adjust the height of the textarea based on its content
      const adjustHeight = () => {
        if (currentTextarea) {
          currentTextarea.style.height = 'auto';
          currentTextarea.style.height = `${currentTextarea.scrollHeight + 14}px`;
        }
      };

      return () => {
        if (currentTextarea) {
          currentTextarea.removeEventListener('input', adjustHeight);
        }
      };
    }, []);

    const cb = useCodeBlockEditorContext();

    return (
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <textarea
          ref={textareaRef}
          style={textareaStyle}
          rows={3}
          defaultValue={props.code}
          onChange={(e) => cb.setCode(e.target.value)}
        />
      </div>
    );
  },
};

function Editor({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <OriginMDXEditor
      contentEditableClassName="prose"
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <ListsToggle />
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === 'codeblock',
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    when: (editor) => editor?.editorType === 'sandpack',
                    contents: () => <ShowSandpackInfo />,
                  },
                  {
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                        <InsertSandpack />
                      </>
                    ),
                  },
                ]}
              />
            </>
          ),
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        codeBlockPlugin({
          defaultCodeBlockLanguage: 'js',
          codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor],
        }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            txt: 'text',
            js: 'JavaScript',
            ts: 'TypeScript',
            tsx: 'TypeScript (React)',
            jsx: 'JavaScript (React)',
            css: 'CSS',
            python: 'Python',
            bash: 'Bash',
            '': 'Plain Text',
          },
        }),
        markdownShortcutPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}

const InitializedEditor = dynamic(() => Promise.resolve(Editor), {
  // Make sure we turn SSR off
  ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const MDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
  <InitializedEditor {...props} editorRef={ref} />
));

// TS complains without the following line
MDXEditor.displayName = 'MDXEditor';
