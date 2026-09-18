"use client";
import * as React from "react";

export type ImageStatus = "loading" | "success" | "failure";

export function useImageStatus(src?: string): ImageStatus {
  const [status, setStatus] = React.useState<ImageStatus>(() => (src ? "loading" : "failure"));

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

  return status;
}
