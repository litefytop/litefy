import React from "react";

export interface PreviewProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Preview({ children, title, className }: PreviewProps) {
  return (
    <div className={`flex flex-col my-6 border rounded-lg overflow-hidden min-h-100 ${className || ""}`}>
      {title && (
        <div className="px-4 py-2 border-b bg-muted/50 text-sm font-medium">
          {title}
        </div>
      )}
      <div className="p-6 flex items-center justify-center h-full flex-1">
        {children}
      </div>
    </div>
  );
}
