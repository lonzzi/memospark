import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { editorAtom } from '../editor';

export const useEditorAtom = () => useAtom(editorAtom);
export const useEditorAtomValue = () => useAtomValue(editorAtom);
export const useSetEditorAtom = () => useSetAtom(editorAtom);
