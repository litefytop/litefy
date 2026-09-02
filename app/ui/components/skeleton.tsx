"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface SkeletonProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div {...props} className={cn("size-full animate-pulse bg-neutral", className)} />;
}
