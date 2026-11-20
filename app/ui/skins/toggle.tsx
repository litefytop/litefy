import { Toggle as ToggleHeadless, ToggleGroup as ToggleGroupHeadless } from "@/ui";
import type { ToggleProps, ToggleGroupProps } from "@/ui";
import { cn } from "../utils/cn";


const toggleFrameClasses =
  "inline-flex min-h-control min-w-control cursor-pointer select-none items-center justify-center gap-x-2 " +
  "whitespace-nowrap border-hair border-border bg-background px-[calc(var(--spacing)*3+min(var(--radius-pill),var(--height-control)/2))] py-1 " +
  "text-sm font-label case-label tracking-label text-foreground " +
  "shadow-frame motion-frame " +
  "hover:not-disabled:bg-accent hover:not-disabled:text-accent-fg hover:not-disabled:shadow-frame-hover " +
  "active:crush active:shadow-frame-active " +
  "aria-[pressed=true]:bg-primary aria-[pressed=true]:text-primary-fg";

const toggleClasses = cn(toggleFrameClasses, "rounded-pill");

const itemClasses = cn(toggleFrameClasses, "rounded-none px-[calc(var(--spacing)*3)]");

const groupClasses = "grid w-full grid-flow-col auto-cols-fr overflow-hidden rounded-pill";

export function Toggle({ className, ...props }: ToggleProps) {
  return <ToggleHeadless {...props} className={cn(toggleClasses, className)} />;
}

export function ToggleGroup({ className, itemClassName, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupHeadless
      {...props}
      className={cn(groupClasses, className)}
      itemClassName={cn(itemClasses, itemClassName)}
    />
  );
}
