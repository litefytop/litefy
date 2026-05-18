import * as React from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";
type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};
export type SliderProps = Omit<React.ComponentProps<"input">, "type"> & {
  defaultValue?: number;
  orientation?: "horizontal" | "vertical";
  className?: ClassNameValue;
  label?: React.ReactNode;
  description?: React.ReactNode;
  itemProps?: {
  
    label?: WithDataAttributes<ComponentProps<"label">>;
     desc?: WithDataAttributes<ComponentProps<"small">>;
  };
};

const SliderClass = {
  horizontal: "w-full h-2",
  vertical: "max-w-56 h-2 rotate-270",
};

export function Slider({
  className,
  defaultValue,
  orientation = "horizontal",
  label,
  description,
  itemProps ,
  ...props
}: SliderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label {...itemProps?.label} className={cn("text-sm font-medium leading-none py-1 indent-2", itemProps?.label?.className)}>
          {label}
        </label>
      )}

      <input
        type="range"
        defaultValue={defaultValue}
        className={cn(
          "bg-muted rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-4",
          SliderClass[orientation],
        )}
        {...props}
      />

      {description && (
        <small {...itemProps?.desc} className={cn("text-sm indent-2 h-5 text-muted-foreground", itemProps?.desc?.className)}>
          {description}
        </small>
      )}
    </div>
  );
}
