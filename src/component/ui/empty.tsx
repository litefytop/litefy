"use client";

import { ClassNameValue, cn } from "@/lib";


const EmptyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-muted-foreground/50"
  >
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z" />
  </svg>
);

const EmptyDescription = () => (
  <span className="text-sm text-muted-foreground">暂无数据</span>
);

export type EmptyProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
};

function Empty({ className, children, ...props }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full text-center", className)} {...props}>
      {children ?? (
        <>
          <EmptyIcon />
          <EmptyDescription />
        </>
      )}
    </div>
  );
}


export { Empty };
