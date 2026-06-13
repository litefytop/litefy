"use client";

import { CopyIcon } from "lucide-react";
import { type ClassNameValue, cn } from "@/lib";

export type EmptyProps = Omit<React.ComponentProps<"div">, "children"> & {
  className?: ClassNameValue;
} & (
    | {
        children: React.ReactNode;
        icon?: never;
        text?: never;
      }
    | {
        children?: never;
        icon?: React.ReactNode;
        text?: React.ReactNode;
      }
  );

function Empty({ className, children, text, icon, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full text-center gap-2",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {icon ?? <CopyIcon className="size-12 text-muted-foreground/50" />}
          <span className="text-sm text-muted-foreground">
            {text ?? "No Content"}
          </span>
        </>
      )}
    </div>
  );
}

export { Empty };
