import { SegmentGroup as SegmentGroupHeadless } from "@/ui";
import type { SegmentGroupProps } from "@/ui";
import type { CSSProperties } from "react";
import { cn } from "../utils/cn";


const itemClasses =
  "m-1 size-6 cursor-pointer rounded-md border-hair border-border bg-(--swatch-color) shadow-frame " +
  "motion-frame " +
  "aria-checked:shadow-checked " +
  "focus-visible:focus-ring";


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

export function ColorSwatch({ options, ...props }: ColorSwatchProps) {
  return (
    <SegmentGroupHeadless
      {...props}
      itemClassName={cn(itemClasses, "text-transparent")}
      options={options.map((option) => ({
        value: option.value,
        label: option.label,
        disabled: option.disabled,
        attrs: { title: option.label, ...option.attrs },
        style: {
          "--swatch-color": option.color,
          "--shadow-checked": `0 0 0 2px var(--background), 0 0 0 4px ${option.color}`,
        } as CSSProperties,
      }))}
    />
  );
}
