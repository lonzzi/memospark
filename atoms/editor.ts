import type { Post } from '@prisma/client';
import { atomWithImmer } from 'jotai-immer';
import type { EditorInstance } from 'novel';

type EditorState = {
  post: Post | null;
  status: 'idle' | 'loading' | 'saving' | 'error';
  lastSavedAt?: number;
  editor?: EditorInstance;
};

export const editorAtom = atomWithImmer<EditorState>({
  post: null,
  status: 'idle',
});
