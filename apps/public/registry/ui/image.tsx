"use client";

import { ClassNameValue, cn } from "@/lib";
import { useEffect, useState } from "react";

export type ImageProps = React.ComponentProps<"img"> & {
  className?: ClassNameValue;
  fallback?: React.ReactNode;
  src: string;
  skeleton?: React.ReactNode;
  placeholderSrc?: string;
  delay?: number;
};

function Image({
  src,
  alt,
  className,
  fallback,
  skeleton,
  placeholderSrc,
  delay = 0,
  ...props
}: ImageProps) {
  const [status, setStatus] = useState<"loading" | "success" | "failure">("loading");
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanLoad(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!canLoad) return;

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
  }, [src, canLoad]);

  if (status === "loading" || !canLoad) {
    if (placeholderSrc) {
      return (
        <div className={cn("relative overflow-hidden", className)}>
          <img
            src={placeholderSrc}
            alt={alt}
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              "blur-sm scale-110"
            )}
            aria-hidden="true"
          />
        </div>
      );
    }
    return (
      skeleton ?? (
        <div
          role="status"
          aria-label="Loading"
          className={cn("bg-muted animate-pulse rounded-lg size-full p-4", className)}
        />
      )
    );
  }

  if (status === "failure") {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        {fallback ?? <span className="text-muted-foreground text-sm">load failed</span>}
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

export { Image };
