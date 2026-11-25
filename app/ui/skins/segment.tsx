import { SegmentGroup as SegmentGroupHeadless } from "@/ui";
import type { SegmentGroupProps } from "@/ui";
import { buttonLayoutClasses } from "./button";
import { cn } from "../utils/cn";

export type { SegmentGroupProps, SegmentOptionConfig } from "@/ui";

export type SegmentGroupVariant = "borderless" | "bordered" | "well";

const segmentLayoutClasses =
  "inline-flex min-h-control min-w-0 select-none items-center justify-center gap-x-2 " +
  "text-nowrap rounded-sm px-3";
const segmentTextClasses = "control-text text-foreground motion-frame";
const segmentCheckedClasses =
  "aria-checked:bg-primary aria-checked:text-primary-fg";

const segmentClasses = cn(
  segmentLayoutClasses,
  "cursor-pointer",
  segmentTextClasses,
  segmentCheckedClasses,
);

const segmentDisabledClasses = cn(
  segmentLayoutClasses,
  "cursor-not-allowed text-disabled-fg",
);

export const segmentVariants = segmentClasses;

const borderedShellClasses =
  "grid w-fit grid-flow-col auto-cols-fr *:min-w-0 gap-1 rounded-md border-hair border-border p-1 " +
  "control-text text-nowrap text-foreground underline-offset-4";

const borderedCheckedBoxClasses =
  "aria-checked:border-control aria-checked:bg-primary aria-checked:text-primary-fg aria-checked:shadow-frame";
const borderedCheckedHoverClasses = "aria-checked:hover:bg-primary-accent";

const borderedItemClasses = cn(
  buttonLayoutClasses,
  "h-control cursor-pointer px-2 motion-frame hover:underline focus-visible:focus-ring rounded-sm",
  borderedCheckedBoxClasses,
  borderedCheckedHoverClasses,
);

const borderedItemDisabledClasses = cn(
  buttonLayoutClasses,
  "h-control cursor-not-allowed px-2 text-disabled-fg motion-frame rounded-sm",
);

const borderlessGroupClasses =
  "grid w-fit min-w-control grid-flow-col auto-cols-fr select-none";

const wellGroupClasses =
  "grid w-fit min-w-control grid-flow-col auto-cols-fr *:min-w-0 items-center rounded-lg border-frame border-border bg-well p-1.5 shadow-well " +
  "control-text text-nowrap text-foreground";

const wellItemLayoutClasses =
  "inline-flex min-h-control select-none items-center justify-center px-3";
const wellItemCornerClasses =
  "rounded-(--radius-well-inner) motion-frame";
const wellItemHoverClasses =
  "hover:bg-accent hover:text-accent-fg";
const wellItemCheckedClasses =
  "aria-checked:bg-primary aria-checked:text-primary-fg aria-checked:shadow-subtle " +
  "aria-checked:hover:bg-primary-accent";

const wellItemClasses = cn(
  wellItemLayoutClasses,
  "cursor-pointer",
  wellItemCornerClasses,
  wellItemHoverClasses,
  wellItemCheckedClasses,
);

const wellItemDisabledClasses = cn(
  wellItemLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
  wellItemCornerClasses,
);

function withDisabledOptions(
  options: SegmentGroupProps["options"],
  disabled: boolean | undefined,
  normalClasses: string,
  disabledClasses: string,
  itemClassName: string | undefined,
) {
  return options.map((option) => ({
    ...option,
    className: cn(
      disabled || option.disabled ? disabledClasses : normalClasses,
      itemClassName,
      option.className,
    ),
  }));
}

export interface SegmentGroupSkinProps extends SegmentGroupProps {
  variant?: SegmentGroupVariant;
}

export function SegmentGroup({ variant = "bordered", className, itemClassName, ...props }: SegmentGroupSkinProps) {
  if (variant === "borderless") {
    return (
      <SegmentGroupHeadless
        {...props}
        className={cn(borderlessGroupClasses, className)}
        options={withDisabledOptions(props.options, props.disabled, segmentVariants, segmentDisabledClasses, itemClassName)}
      />
    );
  }
  if (variant === "well") {
    return (
      <SegmentGroupHeadless
        {...props}
        className={cn(wellGroupClasses, className)}
        options={withDisabledOptions(props.options, props.disabled, wellItemClasses, wellItemDisabledClasses, itemClassName)}
      />
    );
  }
  return (
    <SegmentGroupHeadless
      {...props}
      className={cn(borderedShellClasses, className)}
      options={withDisabledOptions(props.options, props.disabled, borderedItemClasses, borderedItemDisabledClasses, itemClassName)}
    />
  );
}
