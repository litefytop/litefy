"use client";

import { ClassNameValue, cn } from "@/lib";
import { Toaster as Sonner, type ToasterProps as SonnerToasterProps } from "sonner";
import { CircleCheckIcon, CircleInfoIcon, TriangleAlertIcon, XIcon, SpinIcon } from "@/component";


export type ToasterProps = Omit<SonnerToasterProps, "className" | "icons"> & {
  className?: ClassNameValue;
};

const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn("text-popover-foreground bg-popover", className)}
      icons={{
        success: <CircleCheckIcon className="size-4 text-green-500" />,
        info: <CircleInfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <XIcon className="size-4 text-destructive" />,
        loading: <SpinIcon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  );
};




export { Toaster };
