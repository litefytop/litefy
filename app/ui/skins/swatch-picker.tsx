import { SegmentGroup as SegmentGroupHeadless } from "@/ui";
import type { SegmentGroupProps } from "@/ui";
import type { CSSProperties } from "react";
import { cn } from "../utils/cn";


const itemClasses =
  "m-1 size-6 cursor-pointer rounded-md border-hair border-border bg-(--swatch-color) shadow-frame " +
  "motion-frame " +
  "aria-checked:shadow-checked " +
  "disabled:opacity-50 " +
  "focus-visible:focus-ring";


export const swatchPickerItemClasses = itemClasses;

export interface SwatchPickerOptionConfig {
  value: string;
  label: string;
  color: string;
  disabled?: boolean;
  /* Per-item data attributes pinned on the dot — lets a consumer anchor an option
     to a fixed ramp stop (e.g. data-brand="default") so its preview does not drift
     with the active selection. */
  attrs?: Record<string, string>;
}

export type SwatchPickerProps = Omit<SegmentGroupProps, "options" | "itemClassName" | "children"> & {
  options: SwatchPickerOptionConfig[];
};

export function SwatchPicker({ options, ...props }: SwatchPickerProps) {
  return (
    <SegmentGroupHeadless
      {...props}
      itemClassName={cn(itemClasses, "text-transparent")}
      options={options.map((option) => ({
        value: option.value,
        label: option.label,
        disabled: option.disabled,
        attrs: option.attrs,
        style: {
          "--swatch-color": option.color,
          "--shadow-checked": `0 0 0 2px var(--background), 0 0 0 4px ${option.color}`,
        } as CSSProperties,
      }))}
    />
  );
}
