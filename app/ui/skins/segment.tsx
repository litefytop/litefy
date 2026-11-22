import { SegmentGroup as SegmentGroupHeadless } from "@/ui";
import type { SegmentGroupProps } from "@/ui";
import { buttonVariants } from "./button";
import { cn } from "../utils/cn";

export type { SegmentGroupProps, SegmentOptionConfig } from "@/ui";

export type SegmentGroupVariant = "primary" | "text";

const shellClasses =
  "grid w-fit grid-flow-col auto-cols-fr *:min-w-0 gap-1 rounded-md border-hair border-border p-1";

const segmentCheckedBoxClasses =
  "aria-[checked=true]:border-control aria-[checked=true]:border-border aria-[checked=true]:bg-primary " +
  "aria-[checked=true]:text-primary-fg aria-[checked=true]:shadow-frame";
const segmentCheckedHoverClasses = "aria-[checked=true]:hover:bg-primary-accent";

const itemClasses =
  cn(
    buttonVariants.text,
    "min-h-control min-w-0 rounded-sm disabled:dim",
    segmentCheckedBoxClasses,
    segmentCheckedHoverClasses,
  );

const textGroupClasses =
  "grid w-fit min-w-control grid-flow-col auto-cols-fr cursor-pointer select-none";

const textItemBaseClasses =
  "relative inline-flex min-h-control cursor-pointer select-none items-center justify-center px-3 " +
  "text-sm font-label tracking-label case-label text-surface-fg underline-offset-4 disabled:dim";
const textItemCheckedClasses =
  "aria-[checked=true]:text-primary aria-[checked=true]:font-strong aria-[checked=true]:underline";

const textItemClasses = cn(textItemBaseClasses, textItemCheckedClasses);

export interface SegmentGroupSkinProps extends SegmentGroupProps {
  variant?: SegmentGroupVariant;
}

export function SegmentGroup({ variant, className, itemClassName, ...props }: SegmentGroupSkinProps) {
  if (variant === "text") {
    return (
      <SegmentGroupHeadless
        {...props}
        className={cn(textGroupClasses, className)}
        itemClassName={cn(textItemClasses, itemClassName)}
      />
    );
  }

  return (
    <SegmentGroupHeadless
      {...props}
      className={cn(shellClasses, className)}
      itemClassName={cn(itemClasses, itemClassName)}
    />
  );
}
