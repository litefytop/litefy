"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface CapsuleProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function Capsule({ children, className, ...props }: CapsuleProps) {
  return (
    <div {...props} className={cn(Capsule.className, className)}>
      {children}
    </div>
  );
}

Capsule.className =
  "inline-flex items-center overflow-hidden rounded-md *:rounded-none *:px-2 *:py-1";
