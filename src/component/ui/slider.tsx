import * as React from "react";
import { cn, ClassNameValue } from "@/lib";

export type SliderProps = Omit<React.ComponentProps<"input">, "type"> & {
  defaultValue?: number;
  orientation?: "horizontal" | "vertical";
  className?: ClassNameValue;
  area?: string;
};

function Slider({
  className,
  defaultValue,
  orientation = "horizontal",
  area,
  ...props
}: SliderProps) {
  return (
    <input
      type="range"
      defaultValue={defaultValue}
      className={cn(
        Slider.class.base,
        Slider.class.orientation[orientation],
        className,
      )}
      style={{ gridArea: area }}
      {...props}
    />
  );
}

Slider.class = {
  base: "bg-muted rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  orientation: {
    horizontal: "w-full h-2 ",
    vertical: "max-w-56 h-2 rotate-270",
  },
};

export { Slider };
