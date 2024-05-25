import type { Post } from '@prisma/client';
import { atom } from 'jotai';

export const currentPostAtom = atom<Post | null>(null);
