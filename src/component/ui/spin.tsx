"use client";

import { ClassNameValue, cn } from "@/lib";
import { SpinIcon } from "./icons";

export type SpinProps = React.ComponentProps<"svg"> & {
  className?: ClassNameValue;
};

function Spin({ className, ...props }: SpinProps) {
  return (
    <SpinIcon
      className={cn("animate-spin", className)}
      {...props}
    />
  );
}

export { Spin };
