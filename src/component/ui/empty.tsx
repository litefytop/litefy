"use client";

import { ClassNameValue, cn } from "@/lib";
import { CopyIcon } from "lucide-react";

export type EmptyProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  defaultIcon?: React.ReactNode;
  defaultText?: React.ReactNode;
};

function Empty({
  className,
  defaultIcon,
  defaultText,
  children,
  ...props
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full text-center gap-2",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {defaultIcon ?? <CopyIcon className="size-12 text-muted-foreground/50" />}
          <span className="text-sm text-muted-foreground">
            {defaultText ?? "No Content"}
          </span>
        </>
      )}
    </div>
  );
}

export { Empty };
