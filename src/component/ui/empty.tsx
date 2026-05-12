"use client";

import { ClassNameValue, cn } from "@/lib";
import { CopyIcon } from "@/component";

export type EmptyProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  children?: React.ReactNode;
};

function Empty({ className, children, ...props }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full text-center", className)} {...props}>
      {children ?? (
        <>
          <CopyIcon className="size-12 text-muted-foreground/50" />
          <span className="text-sm text-muted-foreground">No Content</span>
        </>
      )}
    </div>
  );
}

export { Empty };
