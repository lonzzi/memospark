import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { twMerge } from 'tailwind-merge';

dayjs.extend(relativeTime);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: number) {
  return dayjs(date).fromNow();
}
