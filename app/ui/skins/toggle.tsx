import { Toggle as ToggleHeadless, ToggleGroup as ToggleGroupHeadless } from "@/ui";
import type { ToggleProps, ToggleGroupProps } from "@/ui";
import { cn } from "../utils/cn";

export type ToggleGroupVariant = "outline" | "well";

export interface ToggleGroupSkinProps extends ToggleGroupProps {
  variant?: ToggleGroupVariant;
}

const toggleFrameClasses =
  "inline-flex min-h-control min-w-control cursor-pointer select-none items-center justify-center gap-x-2 disabled:cursor-not-allowed " +
  "whitespace-nowrap border-hair border-border bg-background px-[calc(var(--spacing)*3+min(var(--radius-pill),var(--height-control)/2))] py-1 " +
  "text-sm font-label case-label tracking-label text-foreground " +
  "shadow-frame motion-frame " +
  "hover:not-disabled:bg-accent hover:not-disabled:text-accent-fg hover:not-disabled:shadow-frame-hover " +
  "active:crush active:shadow-frame-active " +
  "aria-[pressed=true]:bg-primary aria-[pressed=true]:text-primary-fg";

const toggleClasses = cn(toggleFrameClasses, "rounded-pill");

const outlineGroupClasses =
  "grid w-full grid-flow-col auto-cols-fr overflow-hidden rounded-pill border-hair border-border bg-background";

const outlineItemClasses =
  "inline-flex min-h-control min-w-control cursor-pointer select-none items-center justify-center gap-x-2 disabled:cursor-not-allowed " +
  "whitespace-nowrap rounded-none px-3 py-1 " +
  "text-sm font-label case-label tracking-label text-foreground " +
  "motion-frame " +
  "not-first:border-l-hair not-first:border-border " +
  "hover:not-disabled:not-aria-[pressed=true]:bg-accent hover:not-disabled:not-aria-[pressed=true]:text-accent-fg " +
  "active:crush " +
  "aria-[pressed=true]:bg-primary aria-[pressed=true]:text-primary-fg";

const wellGroupClasses =
  "grid w-fit min-w-control grid-flow-col auto-cols-fr *:min-w-0 items-center rounded-lg border-frame border-border bg-well p-1.5 shadow-well";

const wellItemClasses =
  "inline-flex min-h-control cursor-pointer select-none items-center justify-center px-3 " +
  "whitespace-nowrap text-sm font-strong tracking-label case-label text-surface-fg disabled:cursor-not-allowed disabled:opacity-50 " +
  "rounded-[max(0px,calc(var(--radius-lg)-var(--spacing(1.5))-var(--border-width-frame)))] motion-frame " +
  "hover:not-disabled:not-aria-[pressed=true]:bg-accent hover:not-disabled:not-aria-[pressed=true]:text-accent-fg " +
  "aria-[pressed=true]:bg-background aria-[pressed=true]:text-primary aria-[pressed=true]:shadow-subtle";

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
