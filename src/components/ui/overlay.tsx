"use client";

import { ClassNameValue, cn } from "@/lib";

const overlayClass = "w-full h-full bg-muted absolute z-50 top-0 flex items-center justify-center";

export type OverlayProps = Omit<React.HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: ClassNameValue;
};

function Overlay({ className, children, ...props }: OverlayProps) {
  return (
    <div className={cn(Overlay.class, className)} {...props}>
      {children}
    </div>
  );
}

Overlay.class = overlayClass;

export { Overlay };
