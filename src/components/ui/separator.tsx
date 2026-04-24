"use client";

import { cn, ClassNameValue } from "@/lib";


const directionClass = {
  horizontal: "h-px w-full my-5",
  vertical: "h-full w-px mx-5",
};

export type SeparatorDirection = keyof typeof directionClass;

export type SeparatorContent = {
  content?: React.ReactNode;
  className?: ClassNameValue;
};

export type SeparatorProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className"
> & {
  direction?: SeparatorDirection;
  className?: ClassNameValue;
  content?: SeparatorContent;
};

function Separator({
  className,
  direction = "horizontal",
  content,
  children,
  ...props
}: SeparatorProps) {
  const hasContent = content?.content || children;

  return (
    <div
      aria-hidden={true}
      role={"separator"}
      className={cn("bg-border relative", directionClass[direction], className)}
      {...props}
    >
      {hasContent && (
        <span
          className={cn(
            "bg-background text-muted-foreground absolute px-2 whitespace-nowrap right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 w-fit",
            content?.className,
          )}
        >
          {content?.content || children}
        </span>
      )}
    </div>
  );
}

export { Separator };
