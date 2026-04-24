"use client";


import { ClassNameValue, cn } from "@/lib";
import { Show } from "@/components";
import { useEffect, useState } from "react";


export type ImgProps = React.ComponentProps<"img"> & {
  className?: ClassNameValue;
  area?: string;
  fallback?: React.ReactNode;
};

function Img({ src = "", alt = "", className, area, fallback, ...props }: ImgProps) {
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
        data-slot="img"
        src={src}
        alt={alt}
        {...props}
        style={{ ...props.style, gridArea: area }}
        className={cn("object-cover", className)}
      />
    </Show>
  );
}


export { Img };
