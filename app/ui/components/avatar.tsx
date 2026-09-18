"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useImageStatus } from "../utils/use-image-status";

export interface AvatarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function AvatarRoot({ className, ...props }: AvatarRootProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex aspect-square overflow-hidden items-center justify-center size-12 text-2xl rounded-md",
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
  className?: ClassNameValue;
  style?: React.CSSProperties;
  skeleton?: React.ReactNode;
  fallback?: React.ReactNode;
  classNames?: { image?: ClassNameValue };
  styles?: { image?: React.CSSProperties };
}

export function Avatar({
  className,
  style,
  skeleton,
  fallback,
  src,
  classNames,
  styles,
  ...props
}: AvatarProps) {
  const status = useImageStatus(src);

  return (
    <AvatarRoot className={className} style={style}>
      {status === "loading" && skeleton}
      {status === "failure" && fallback}
      {status === "success" && (
        <AvatarImage {...props} src={src} className={classNames?.image} style={styles?.image} />
      )}
    </AvatarRoot>
  );
}
