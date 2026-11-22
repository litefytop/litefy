import { Toggle as ToggleHeadless, ToggleGroup as ToggleGroupHeadless } from "@/ui";
import type { ToggleProps, ToggleGroupProps } from "@/ui";
import { cn } from "../utils/cn";

export type ToggleGroupVariant = "outline" | "well";

export interface ToggleGroupSkinProps extends ToggleGroupProps {
  variant?: ToggleGroupVariant;
}

const toggleBaseClasses =
  "inline-flex min-h-control min-w-control cursor-pointer select-none items-center justify-center gap-x-2 whitespace-nowrap disabled:dim";
const toggleFaceClasses =
  "border-hair border-border bg-background px-[max(var(--spacing)*3,min(var(--radius-pill),var(--height-control)/2))] py-1";
const toggleTextClasses =
  "text-sm font-label case-label tracking-label text-foreground shadow-frame motion-frame";
const toggleHoverClasses =
  "hover:not-disabled:bg-accent hover:not-disabled:text-accent-fg hover:not-disabled:shadow-frame-hover";
const togglePressClasses = "active:crush active:shadow-frame-active";
const togglePressedClasses =
  "aria-[pressed=true]:bg-primary aria-[pressed=true]:text-primary-fg";

const toggleFrameClasses = cn(
  toggleBaseClasses,
  toggleFaceClasses,
  toggleTextClasses,
  toggleHoverClasses,
  togglePressClasses,
  togglePressedClasses,
);

const toggleClasses = cn(toggleFrameClasses, "rounded-pill");

const outlineGroupClasses =
  "grid w-full grid-flow-col auto-cols-fr overflow-hidden rounded-pill border-hair border-border bg-background";

const outlineItemBaseClasses =
  "inline-flex min-h-control min-w-control cursor-pointer select-none items-center justify-center gap-x-2 " +
  "whitespace-nowrap rounded-none px-3 py-1 disabled:dim";
const outlineItemTextClasses =
  "text-sm font-label case-label tracking-label text-foreground motion-frame " +
  "not-first:border-l-hair not-first:border-border";
const outlineItemStateClasses =
  "hover:not-disabled:not-aria-[pressed=true]:bg-accent hover:not-disabled:not-aria-[pressed=true]:text-accent-fg " +
  "active:crush aria-[pressed=true]:bg-primary aria-[pressed=true]:text-primary-fg";

const outlineItemClasses = cn(outlineItemBaseClasses, outlineItemTextClasses, outlineItemStateClasses);

const wellGroupClasses =
  "grid w-fit min-w-control grid-flow-col auto-cols-fr *:min-w-0 items-center rounded-lg border-frame border-border bg-well p-1.5 shadow-well";

const wellItemBaseClasses =
  "inline-flex min-h-control cursor-pointer select-none items-center justify-center px-3 " +
  "whitespace-nowrap text-sm font-strong tracking-label case-label text-surface-fg disabled:dim";
const wellItemCornerClasses =
  "rounded-[max(0px,calc(var(--radius-lg)-var(--spacing(1.5))-var(--border-width-frame)))] motion-frame";
const wellItemHoverClasses =
  "hover:not-disabled:not-aria-[pressed=true]:bg-accent hover:not-disabled:not-aria-[pressed=true]:text-accent-fg";
const wellItemPressedClasses =
  "aria-[pressed=true]:bg-background aria-[pressed=true]:text-primary aria-[pressed=true]:shadow-subtle";

const wellItemClasses = cn(wellItemBaseClasses, wellItemCornerClasses, wellItemHoverClasses, wellItemPressedClasses);

export function Toggle({ className, ...props }: ToggleProps) {
  return <ToggleHeadless {...props} className={cn(toggleClasses, className)} />;
}

export function ToggleGroup({ variant = "outline", className, itemClassName, ...props }: ToggleGroupSkinProps) {
  if (variant === "well") {
    return (
      <ToggleGroupHeadless
        {...props}
        className={cn(wellGroupClasses, className)}
        itemClassName={cn(wellItemClasses, itemClassName)}
      />
    );
  }
  return (
    <ToggleGroupHeadless
      {...props}
      className={cn(outlineGroupClasses, className)}
      itemClassName={cn(outlineItemClasses, itemClassName)}
    />
  );
}
