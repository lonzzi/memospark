'use client';

export const EditorWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none"></div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};
