import {
  FloatingToc as FloatingTocHeadless,
  FloatingTocTrigger as FloatingTocTriggerHeadless,
  FloatingTocBar as FloatingTocBarHeadless,
  FloatingTocContent as FloatingTocContentHeadless,
  FloatingTocItem as FloatingTocItemHeadless,
} from "@/ui";
import type {
  FloatingTocProps,
  FloatingTocTriggerProps,
  FloatingTocBarProps,
  FloatingTocContentProps,
  FloatingTocItemProps,
} from "@/ui";
import { cn } from "../utils/cn";

export function FloatingToc(props: FloatingTocProps) {
  return <FloatingTocHeadless {...props} />;
}

export function FloatingTocTrigger({ className, ...props }: FloatingTocTriggerProps) {
  return (
    <FloatingTocTriggerHeadless
      {...props}
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-40 flex flex-col p-2 rounded-lg cursor-pointer",
        "focus-visible:focus-ring",
        "data-[placement=right]:right-4 data-[placement=right]:items-end",
        "data-[placement=left]:left-4 data-[placement=left]:items-start",
        className
      )}
    />
  );
}

export function FloatingTocBar({ className, ...props }: FloatingTocBarProps) {
  return (
    <FloatingTocBarHeadless
      {...props}
      className={cn(
        "block h-3.5 w-4 py-1.5 rounded-full bg-surface bg-clip-content",
        "transition-[transform,background-color] duration-sm ease-frame",
        "data-[placement=right]:origin-right data-[placement=left]:origin-left",
        "data-[depth=2]:w-3.5 data-[depth=3]:w-3 data-[depth=4]:w-2.5 data-[depth=5]:w-2",
        "data-active:scale-x-150 data-active:bg-primary",
        className
      )}
    />
  );
}

export function FloatingTocContent({ className, ...props }: FloatingTocContentProps) {
  return (
    <FloatingTocContentHeadless
      {...props}
      className={cn(
        "min-w-[10rem] max-w-[min(16rem,calc(100vw-2rem))] max-h-[min(24rem,60vh)] overflow-auto rounded-xl border-frame border-border p-1",
        "bg-surface-raised text-foreground shadow-elevated",
        className
      )}
    />
  );
}

export function FloatingTocItem({ className, ...props }: FloatingTocItemProps) {
  return (
    <FloatingTocItemHeadless
      {...props}
      className={cn(
        "block w-full text-start py-1 ps-3 pe-3 rounded-md text-sm leading-5 text-surface-fg cursor-pointer",
        "hover:bg-accent hover:text-accent-fg",
        "data-active:font-strong data-active:text-primary",
        "data-[depth=2]:ps-6 data-[depth=3]:ps-9 data-[depth=4]:ps-12 data-[depth=5]:ps-15",
        className
      )}
    />
  );
}
