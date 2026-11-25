import { ChipGroup as ChipGroupHeadless } from "@/ui";
import type { ChipGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "max-w-full overflow-hidden";

const rowClasses = "flex min-w-0 items-center gap-x-1.5";

const measureClasses =
  "flex min-w-0 items-center gap-x-1.5 pointer-events-none absolute -top-[9999px] -left-[9999px]";

const moreClasses = "inline-flex shrink-0";

export const chipBase = cn(
  "inline-flex min-h-5 items-center gap-1 rounded-sm border-control border-border px-2",
  "text-xs leading-4 tracking-label case-label whitespace-nowrap no-underline",
  "[&:is(a,button)]:min-h-control",
);

export const chipVariants = {
  surface: "bg-surface-raised text-surface-raised-fg",
  primary: "bg-primary text-primary-fg",
  outline: "bg-transparent text-foreground",
  success: "bg-success text-success-fg",
  warning: "bg-warning text-warning-fg",
  danger: "bg-danger text-danger-fg",
  info: "bg-info text-info-fg",
};

export type ChipVariant = keyof typeof chipVariants;

export const chipClasses = cn(chipBase, chipVariants.surface);

function pickVariant(value: unknown): ChipVariant {
  return typeof value === "string" && value in chipVariants
    ? (value as ChipVariant)
    : "surface";
}

export function ChipGroup({ className, classNames, ...props }: ChipGroupProps) {
  const chipClass = cn(
    chipBase,
    chipVariants[pickVariant((props as Record<string, unknown>)["data-variant"])],
    "max-w-40 shrink-0 overflow-hidden text-ellipsis",
  );
  return (
    <ChipGroupHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        {
          row: rowClasses,
          chip: chipClass,
          more: moreClasses,
          measure: measureClasses,
        },
        classNames,
      )}
    />
  );
}