"use client";


import { ClassNameValue, cn } from "@/lib";
import { Show } from "@/component";
import { useEffect, useState } from "react";


export type ImageProps = React.ComponentProps<"img"> & {
  className?: ClassNameValue;
  area?: string;
  fallback?: React.ReactNode;
};

function Image({ src = "", alt = "", className, area, fallback, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [failure, setFailure] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setFailure(true);
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src]);

  return (
    <Show loading={isLoading} failure={failure} fallback={fallback}>
      <img
        src={src}
        alt={alt}
        {...props}
        style={{ ...props.style, gridArea: area }}
        className={cn("object-cover", className)}
      />
    </Show>
  );
}


export { Image };
