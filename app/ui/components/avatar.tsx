"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface AvatarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function AvatarRoot({ className, ...props }: AvatarRootProps) {
  return (
    <div
      {...props}
      className={cn("flex aspect-square overflow-hidden items-center justify-center", className)}
    />
  );
}
export interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "className"> {
  className?: ClassNameValue;
}
export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return <img {...props} className={cn("w-full h-full", className)} />;
}

export type AvatarProps = {
  className?: ClassNameValue;
  src: string;
  skeleton?: React.ReactNode;
  fallback?: React.ReactNode;
  slots?: {
    wrapper?: Omit<React.ComponentProps<"div">, "children">;
  };
} & Omit<React.ComponentProps<"img">, "className" | "src">;

export function Avatar({ src, skeleton, fallback, className, slots, ...props }: AvatarProps) {
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
    <AvatarRoot
      {...slots?.wrapper}
      className={cn("bg-muted border", className, slots?.wrapper?.className)}
    >
      {status === "loading" && skeleton}
      {status === "failure" && fallback}
      {status === "success" && (
        <AvatarImage
          {...props}
          src={src}
          className="object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
    </AvatarRoot>
  );
}
