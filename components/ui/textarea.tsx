import { cn } from '@/lib/utils';
import * as React from 'react';

import ContentEditable from 'react-contenteditable';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export interface AutoHeightTextareaProps
  extends Omit<React.ComponentProps<typeof ContentEditable>, 'html'> {
  value: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

const AutoHeightTextarea: React.FC<AutoHeightTextareaProps> = ({ className, value, ...props }) => {
  return (
    <ContentEditable
      className={cn(
        'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 break-all',
        className,
      )}
      {...props}
      html={value}
      ref={null}
    />
  );
};
AutoHeightTextarea.displayName = 'AutoHeightTextarea';

export { Textarea, AutoHeightTextarea };
