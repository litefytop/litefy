"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export type ImageProps = {
  className?: ClassNameValue;
  src: string;
  alt?: string;
  fallback?: React.ReactNode;
  placeholderSrc?: string;
  loadingIndicator?: React.ReactNode;
  onRetry?: () => void;
} & Omit<React.ComponentProps<"img">, "className">;

export function Image({
  src,
  alt,
  className,
  fallback,
  placeholderSrc,
  loadingIndicator,
  onRetry,
  ...props
}: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "success" | "failure">(
    "loading",
  );
  const lastSrcRef = React.useRef<string | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (lastSrcRef.current === src && status !== "loading") {
      return;
    }
    lastSrcRef.current = src;
    setStatus("loading");

    let isActive = true;
    const img = new window.Image();
    img.onload = () => {
      if (isActive) {
        React.startTransition(() => {
          setStatus("success");
        });
      }
    };
    img.onerror = () => {
      if (isActive) {
        React.startTransition(() => {
          setStatus("failure");
        });
      }
    };
    img.src = src;

    return () => {
      isActive = false;
      img.onload = null;
      img.onerror = null;
      setTimeout(() => {
        if (img.src) img.src = "";
      }, 0);
    };
  }, [src, status]);

  if (status === "loading") {
    if (placeholderSrc) {
      return (
        <div
          className={cn("relative overflow-hidden", className)}
          role="status"
          aria-label="Loading image"
          aria-busy="true"
          style={{ contentVisibility: "auto" }}
        >
          <img
            src={placeholderSrc}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover blur-sm scale-110"
            aria-hidden="true"
          />
        </div>
      );
    }

    if (loadingIndicator) {
      return (
        <div
          className={cn("flex items-center justify-center", className)}
          role="status"
          aria-label="Loading image"
          aria-busy="true"
          style={{ contentVisibility: "auto" }}
        >
          {loadingIndicator}
        </div>
      );
    }

    return (
      <div
        role="status"
        aria-label="Loading image"
        aria-busy="true"
        className={cn(
          "bg-muted animate-pulse rounded-lg size-full p-4",
          className,
        )}
        style={{ contentVisibility: "auto" }}
      />
    );
  }

  if (status === "failure") {
    return (
      <div
        className={cn(
          "bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm",
          className,
        )}
        role="alert"
        aria-live="polite"
        style={{ contentVisibility: "auto" }}
      >
        {fallback ?? (
          <>
            <span>Load failed</span>
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  setStatus("loading");
                  onRetry();
                }}
                className="text-xs underline hover:no-underline"
              >
                Retry
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      {...props}
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      style={{ contentVisibility: "auto", ...props.style }}
      loading="lazy"
      decoding="async"
    />
  );
}
