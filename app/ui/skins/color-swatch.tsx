import { SegmentGroup as SegmentGroupHeadless } from "@/ui";
import type { SegmentGroupProps } from "@/ui";
import type { CSSProperties } from "react";
import { cn } from "../utils/cn";


const itemLayoutClasses = "m-1 size-6 rounded-md border-hair border-border shadow-frame motion-frame";

const itemClasses = cn(
  itemLayoutClasses,
  "cursor-pointer bg-(--swatch-color) aria-checked:shadow-checked focus-visible:focus-ring",
);

const itemDisabledClasses = cn(
  itemLayoutClasses,
  "cursor-not-allowed bg-disabled",
);


export const colorSwatchItemClasses = itemClasses;

export interface ColorSwatchOptionConfig {
  value: string;
  label: string;
  color: string;
  disabled?: boolean;
  attrs?: Record<string, string>;
}

export type ColorSwatchProps = Omit<SegmentGroupProps, "options" | "itemClassName" | "children"> & {
  options: ColorSwatchOptionConfig[];
};

export function ColorSwatch({ options, disabled, ...props }: ColorSwatchProps) {
  return (
    <SegmentGroupHeadless
      {...props}
      disabled={disabled}
      itemClassName={cn(itemClasses, "text-transparent")}
      options={options.map((option) => {
        const optionDisabled = disabled || option.disabled;
        return {
          value: option.value,
          label: option.label,
          disabled: optionDisabled,
          className: cn(optionDisabled ? itemDisabledClasses : itemClasses, "text-transparent"),
          attrs: { title: option.label, ...option.attrs },
          style: {
            "--swatch-color": optionDisabled ? "var(--color-disabled)" : option.color,
            "--shadow-checked": optionDisabled
              ? "none"
              : `0 0 0 2px var(--background), 0 0 0 4px ${option.color}`,
          } as CSSProperties,
        };
      })}
    />
  );
}
