'use client';

import { defaultExtensions } from './extensions';
import GenerativeMenuSwitch from './generative/generative-menu-switch';
import { uploadFn } from './image-upload';
import './prosemirror.css';
import { ColorSelector } from './selectors/color-selector';
import { LinkSelector } from './selectors/link-selector';
import { NodeSelector } from './selectors/node-selector';
import { TextButtons } from './selectors/text-buttons';
import { slashCommand, suggestionItems } from './slash-command';
import { castDraft } from 'immer';
import { useParams } from 'next/navigation';
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from 'novel';
import { ImageResizer, handleCommandNavigation } from 'novel/extensions';
import { handleImageDrop, handleImagePaste } from 'novel/plugins';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { defaultEditorContent } from './content';

import { useSetEditorAtom } from '@/atoms/hooks/editor';

import { Separator } from '@/components/ui/separator';

const extensions = [...defaultExtensions, slashCommand];

type TailwindAdvancedEditorProps = {
  value?: JSONContent;
  onUpdate?: (value: string) => void;
};

const TailwindAdvancedEditor: React.FC<TailwindAdvancedEditorProps> = ({ value, onUpdate }) => {
  const [initialContent, setInitialContent] = useState<undefined | JSONContent>(value);
  const params = useParams();

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const setEditorAtom = useSetEditorAtom();

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON();

    // window.localStorage.setItem('novel-content', JSON.stringify(json));
    if (onUpdate) {
      onUpdate(JSON.stringify(json));
      setEditorAtom((draft) => {
        draft.lastSavedAt = new Date().valueOf();
        draft.status = 'idle';
      });
    }
  }, 500);

  useEffect(() => {
    if (params.id === 'example') {
      setInitialContent(defaultEditorContent);
    }
  }, [params.id]);

  return (
    <div className="relative w-full max-w-screen-lg">
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className="relative min-h-[500px] w-full max-w-screen-lg bg-background sm:mb-[calc(20vh)] sm:rounded-lg"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setEditorAtom((draft) => {
              draft.status = 'saving';
            });
          }}
          slotAfter={<ImageResizer />}
          onCreate={({ editor }) => {
            setEditorAtom((draft) => {
              draft.editor = castDraft(editor);
            });
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command && item.command(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;
