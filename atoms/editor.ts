import type { Post } from '@prisma/client';
import { atomWithImmer } from 'jotai-immer';

type EditorState = {
  post: Post | null;
  status: 'idle' | 'loading' | 'saving' | 'error';
  lastSavedAt?: number;
};

export const editorAtom = atomWithImmer<EditorState>({
  post: null,
  status: 'idle',
});
