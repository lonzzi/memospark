import { type RefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: (...args: unknown[]) => unknown,
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
