import { OpenAI } from 'openai';
import Markdown from 'react-markdown';
import { match } from 'ts-pattern';

import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { createAI, getMutableAIState, render } from 'ai/rsc';

type AIStateItem =
  | {
      readonly role: 'user' | 'assistant' | 'system';
      readonly content: string;
    }
  | {
      readonly role: 'function';
      readonly content: string;
      readonly name: string;
    };

interface UIStateItem {
  readonly id: number;
  readonly display: React.ReactNode;
  readonly completion: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

async function submitUserMessage({
  prompt,
  option,
  command,
}: {
  prompt: string;
  option?: string;
  command?: string;
}): Promise<UIStateItem> {
  'use server';

  const aiState = getMutableAIState<typeof AI>();
  let completion: string = '';

  aiState.update([...aiState.get(), { role: 'user', content: prompt }]);

  const ui = render({
    model: 'phi3',
    provider: openai,
    messages: match(option)
      .with('continue', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that continues existing text based on context from prior text. ' +
            'Give more weight/priority to the later characters than the beginning ones. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ])
      .with('improve', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that improves existing text. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('shorter', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that shortens existing text. ' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('longer', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that lengthens existing text. ' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('fix', () => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that fixes grammar and spelling errors in existing text. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `The existing text is: ${prompt}`,
        },
      ])
      .with('zap', () => [
        {
          role: 'system',
          content:
            'You area an AI writing assistant that generates text based on a prompt. ' +
            'You take an input from the user and a command for manipulating the text' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: `For this text: ${prompt}. You have to respect the command: ${command}`,
        },
      ])
      .otherwise(() => [
        {
          role: 'system',
          content:
            'You are an AI writing assistant that continues existing text based on context from prior text. ' +
            'Give more weight/priority to the later characters than the beginning ones. ' +
            'Limit your response to no more than 200 characters, but make sure to construct complete sentences.' +
            'Use Markdown formatting when appropriate.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ]) as ChatCompletionMessageParam[],
    ...aiState.get(),
    text: ({ content, done }) => {
      if (done) {
        aiState.done([...aiState.get(), { role: 'assistant', content }]);
        completion = content;
      }

      return <Markdown>{content}</Markdown>;
    },
  });

  return { id: Date.now(), display: ui, completion };
}

const initialAIState: AIStateItem[] = [];
const initialUIState: UIStateItem[] = [];

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState,
  initialAIState,
});
