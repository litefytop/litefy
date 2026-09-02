"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "..";

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
  fallback?: React.ReactNode;
  loadingNode?: React.ReactNode;
  classNames?: { root?: ClassNameValue; image?: ClassNameValue };
  styles?: { root?: React.CSSProperties; image?: React.CSSProperties };
}

export function Image({ src, alt, fallback, loadingNode, classNames, styles }: ImageProps) {
  const [status, setStatus] = React.useState<"loading" | "success" | "failure">("loading");

  React.useEffect(() => {
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
    <ImageRoot className={classNames?.root} style={styles?.root}>
      {status === "loading" && loadingNode}
      {status === "failure" && fallback}
      {status === "success" && (
        <ImageImage src={src} alt={alt} className={classNames?.image} style={styles?.image} />
      )}
    </ImageRoot>
  );
}
