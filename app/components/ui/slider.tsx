import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export type SliderProps = Omit<React.ComponentProps<"input">, "type"> & {
  defaultValue?: number;
  orientation?: "horizontal" | "vertical";
  className?: ClassNameValue;
  invalid?: boolean;
};

const SliderClass = {
  horizontal: "",
  vertical: "rotate-270",
};

export function Slider({
  className,
  defaultValue,
  orientation = "horizontal",
  invalid,
  ...props
}: SliderProps) {
  return (
    <input
      type="range"
      defaultValue={defaultValue}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn(
        "bg-muted rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-4 w-3xs h-2 accent-primary",
        "data-invalid:accent-destructive",
        SliderClass[orientation],
        className,
      )}
      {...props}
    />
  );
}
