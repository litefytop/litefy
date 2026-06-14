"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export type ImageProps = {
  className?: ClassNameValue;
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  placeholderSrc?: string;
} & Omit<React.ComponentProps<"img">, "className">;

export function Image({
  src,
  alt,
  className,
  fallback,
  placeholderSrc,
  ...props
}: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "success" | "failure">(
    "loading",
  );

  React.useEffect(() => {
    let isActive = true;
    const img = new window.Image();
    img.onload = () => {
      if (isActive) setStatus("success");
    };
    img.onerror = () => {
      if (isActive) setStatus("failure");
    };
    img.src = src;
    return () => {
      isActive = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (status === "loading") {
    if (placeholderSrc) {
      return (
        <div className="relative overflow-hidden">
          <img
            src={placeholderSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover blur-sm scale-110"
            aria-hidden="true"
          />
        </div>
      );
    }
    return (
      <div
        role="status"
        aria-label="Loading"
        className={cn(
          "bg-muted animate-pulse rounded-lg size-full p-4",
          className,
        )}
      />
    );
  }

  if (status === "failure") {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground text-sm",
          className,
        )}
      >
        {fallback ?? "load failed"}
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
    />
  );
}
