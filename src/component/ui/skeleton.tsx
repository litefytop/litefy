"use client";


import { cn, ClassNameValue } from "@/lib";

const skeletonclass = "bg-muted animate-pulse rounded";

export type SkeletonProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
};

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonclass, className)}
      {...props}
    />
  );
}

Skeleton.class = skeletonclass;

export { Skeleton };
