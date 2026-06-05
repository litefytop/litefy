"use client";

import { cn, ClassNameValue } from "@/lib";
import { ReactNode, useLayoutEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import React from "react";

export type LoadingProps = React.ComponentProps<"div"> & {
  loading?: boolean;
  children: ReactNode;
  className?: ClassNameValue;
  fallback?: ReactNode;
  skeleton?: ReactNode;
};

function Loading({
  loading = false,
  children,
  className,
  fallback,
  skeleton,
  ...props
}: LoadingProps) {
  const prevLoadingRef = useRef<boolean | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (prevLoadingRef.current === null && loading === false) return;
    if (prevLoadingRef.current === loading) return;

    if (loading) {
      if (prevLoadingRef.current === null) {
        rootRef.current.dataset.loading = "initial";
      } else {
        rootRef.current.dataset.loading = "true";
      }
    } else {
      rootRef.current.dataset.loading = "false";
    }

    prevLoadingRef.current = loading;
  }, [loading]);
  return (
    <div
      {...props}
      className={cn("relative size-full group", className)}
      ref={rootRef}
    >
      {children}
      <div
        className={cn(
          "absolute inset-0 bg-muted size-full hidden",
          "group-data-[loading=initial]:block ",
        )}
      >
        {skeleton}
      </div>
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center size-full opacity-0 pointer-events-none bg-muted/50 z-50",
          "group-data-[loading=true]:pointer-events-auto group-data-[loading=true]:opacity-100",
        )}
      >
        {fallback ?? <LoaderCircle className="size-8 animate-spin" />}
      </div>
    </div>
  );
}

export { Loading };
