"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface AvatarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function AvatarRoot({ className, ...props }: AvatarRootProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex aspect-square overflow-hidden items-center justify-center size-12 text-2xl rounded-full",
        className,
      )}
    />
  );
}
export interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "className"> {
  className?: ClassNameValue;
}
export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <img
      {...props}
      className={cn("size-full object-cover", className)}
      loading="lazy"
      decoding="async"
    />
  );
}

export interface AvatarProps extends Omit<AvatarImageProps, "className" | "style"> {
  skeleton?: React.ReactNode;
  fallback?: React.ReactNode;
  classNames?: { root?: ClassNameValue; image?: ClassNameValue };
  styles?: { root?: React.CSSProperties; image?: React.CSSProperties };
}

export function Avatar({ skeleton, fallback, src, classNames, styles, ...props }: AvatarProps) {
  const [status, setStatus] = React.useState<"loading" | "success" | "failure">("loading");

  React.useEffect(() => {
    if (!src) {
      setStatus("failure");
      return;
    }
    let isActive = true;
    setStatus("loading");
    const img = new window.Image();
    img.onload = () => {
      if (isActive) {
        React.startTransition(() => setStatus("success"));
      }
    };
    img.onerror = () => {
      if (isActive) {
        React.startTransition(() => setStatus("failure"));
      }
    };
    img.src = src;
    return () => {
      isActive = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <AvatarRoot className={classNames?.root} style={styles?.root}>
      {status === "loading" && skeleton}
      {status === "failure" && fallback}
      {status === "success" && (
        <AvatarImage {...props} src={src} className={classNames?.image} style={styles?.image} />
      )}
    </AvatarRoot>
  );
}
