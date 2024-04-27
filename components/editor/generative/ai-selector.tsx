'use client';

import AICompletionCommands from './ai-completion-command';
import AISelectorCommands from './ai-selector-commands';
import type { AI } from '@/actions/ai';
import { ArrowUp } from 'lucide-react';
import { useEditor } from 'novel';
import { addAIHighlight } from 'novel/extensions';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

// import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Command, CommandInput } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

import CrazySpinner from '../ui/icons/crazy-spinner';
import Magic from '../ui/icons/magic';
import { useActions, useUIState } from 'ai/rsc';

//TODO: I think it makes more sense to create a custom Tiptap extension for this functionality https://tiptap.dev/docs/editor/ai/introduction

interface AISelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISelector({ onOpenChange }: AISelectorProps) {
  const { editor } = useEditor();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  useEffect(() => {
    console.log('messages', messages);
    if (messages.length > 0) {
      setIsLoading(false);
    }
  }, [messages]);

  const hasCompletion = messages.length > 0;

  return (
    <Command className="w-[350px]">
      {hasCompletion && (
        <div className="flex max-h-[400px]">
          <ScrollArea>
            <div className="prose p-2 px-4 prose-sm">
              {
                // View messages in UI state
                messages.map((message) => (
                  <div key={message.id}>{message.display}</div>
                ))
              }
            </div>
          </ScrollArea>
        </div>
      )}

      {isLoading && (
        <div className="flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
          <Magic className="mr-2 h-4 w-4 shrink-0" />
          AI is thinking
          <div className="ml-2 mt-1">
            <CrazySpinner />
          </div>
        </div>
      )}
      {!isLoading && editor && (
        <>
          <div className="relative">
            <CommandInput
              value={inputValue}
              onValueChange={setInputValue}
              autoFocus
              placeholder={
                hasCompletion ? 'Tell AI what to do next' : 'Ask AI to edit or generate...'
              }
              onFocus={() => addAIHighlight(editor)}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900"
              onClick={async () => {
                // if (completion)
                //   return complete(completion, {
                //     body: { option: 'zap', command: inputValue },
                //   }).then(() => setInputValue(''));
                setIsLoading(true);
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <Markdown>{inputValue}</Markdown>,
                    completion: inputValue,
                  },
                ]);

                const slice = editor.state.selection.content();
                const text = editor.storage.markdown.serializer.serialize(slice.content);

                const responseMessage = await submitUserMessage({ prompt: text });
                setMessages((currentMessages) => [...currentMessages, responseMessage]);

                setInputValue('');
              }}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          {hasCompletion ? (
            <AICompletionCommands
              onDiscard={() => {
                editor.chain().unsetHighlight().focus().run();
                onOpenChange(false);
              }}
              completion={messages[messages.length - 1].completion}
            />
          ) : (
            <AISelectorCommands
              onSelect={async (value, option) => {
                setIsLoading(true);
                const responseMessage = await submitUserMessage({ prompt: value, option });
                setMessages((currentMessages) => [...currentMessages, responseMessage]);
              }}
            />
          )}
        </>
      )}
    </Command>
  );
}
