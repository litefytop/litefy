"use client";


import { cn, ClassNameValue } from "@/lib";



export type SkeletonProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
};

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-muted animate-pulse rounded", className)}
      {...props}
    />
  );
}



export { Skeleton };
