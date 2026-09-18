"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useImageStatus } from "../utils/use-image-status";

export interface ImageRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function ImageRoot({ className, ...props }: ImageRootProps) {
  return <div {...props} className={cn("relative overflow-hidden", className)} />;
}

export interface ImageImageProps extends Omit<React.ComponentProps<"img">, "className"> {
  className?: ClassNameValue;
  src: string;
}
export function ImageImage({ className, ...props }: ImageImageProps) {
  return (
    <img
      {...props}
      className={cn("size-full object-cover", className)}
      loading="lazy"
      decoding="async"
    />
  );
}

export interface ImageProps extends Omit<ImageImageProps, "className" | "style"> {
  className?: ClassNameValue;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  loadingNode?: React.ReactNode;
  classNames?: { image?: ClassNameValue };
  styles?: { image?: React.CSSProperties };
}

export function Image({
  src,
  alt,
  className,
  style,
  fallback,
  loadingNode,
  classNames,
  styles,
  ...props
}: ImageProps) {
  const status = useImageStatus(src);

  return (
    <ImageRoot className={className} style={style}>
      {status === "loading" && loadingNode}
      {status === "failure" && fallback}
      {status === "success" && (
        <ImageImage
          {...props}
          src={src}
          alt={alt}
          className={classNames?.image}
          style={styles?.image}
        />
      )}
    </ImageRoot>
  );
}
