"use client";
import * as React from "react";
export type ImageStatus = "loading" | "success" | "failure";
export function useImageStatus(src?: string): ImageStatus {
    const [status, setStatus] = React.useState<ImageStatus>(() => (src ? "loading" : "failure"));
    const [prevSrc, setPrevSrc] = React.useState(src);
    if (prevSrc !== src) {
        setPrevSrc(src);
        setStatus(src ? "loading" : "failure");
    }
    React.useEffect(() => {
        if (!src)
            return;
        let isActive = true;
        const img = new window.Image();
        const handleLoad = () => {
            if (isActive) {
                React.startTransition(() => setStatus("success"));
            }
        };
        const handleError = () => {
            if (isActive) {
                React.startTransition(() => setStatus("failure"));
            }
        };
        img.addEventListener("load", handleLoad);
        img.addEventListener("error", handleError);
        img.src = src;
        return () => {
            isActive = false;
            img.removeEventListener("load", handleLoad);
            img.removeEventListener("error", handleError);
        };
    }, [src]);
    return status;
}
