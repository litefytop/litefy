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

const triggerBaseClasses =
  "fixed top-1/2 -translate-y-1/2 z-40 flex flex-col p-2 rounded-lg cursor-pointer focus-visible:focus-ring";
const triggerRightClasses = "data-[placement=right]:right-4 data-[placement=right]:items-end";
const triggerLeftClasses = "data-[placement=left]:left-4 data-[placement=left]:items-start";

const barBaseClasses =
  "block h-3.5 w-4 py-1.5 rounded-full bg-surface bg-clip-content origin-right " +
  "transition-[transform,background-color] duration-sm";
const barOriginClasses = "data-[placement=left]:origin-left";
const barDepthClasses =
  "data-[depth=2]:w-3.5 data-[depth=3]:w-3 data-[depth=4]:w-2.5 data-[depth=5]:w-2";
const barActiveClasses = "data-active:scale-x-150 data-active:bg-primary";

const itemBaseClasses =
  "block w-full text-start py-1 ps-3 pe-3 text-sm leading-5 text-foreground cursor-pointer";
const itemHoverClasses = "hover:bg-accent hover:text-accent-fg";
const itemActiveClasses = "data-active:font-strong data-active:text-primary";
const itemIndentClasses =
  "data-[depth=2]:ps-6 data-[depth=3]:ps-9 data-[depth=4]:ps-12 data-[depth=5]:ps-15";

export function FloatingToc(props: FloatingTocProps) {
  return <FloatingTocHeadless {...props} />;
}

export function FloatingTocTrigger({ className, ...props }: FloatingTocTriggerProps) {
  return (
    <FloatingTocTriggerHeadless
      {...props}
      className={cn(triggerBaseClasses, triggerRightClasses, triggerLeftClasses, className)}
    />
  );
}

export function FloatingTocBar({ className, ...props }: FloatingTocBarProps) {
  return (
    <FloatingTocBarHeadless
      {...props}
      className={cn(barBaseClasses, barOriginClasses, barDepthClasses, barActiveClasses, className)}
    />
  );
}

const tocPanelBaseClasses =
  "min-w-40 max-w-[min(--spacing(64),calc(100vw_-_--spacing(8)))] max-h-[min(--spacing(96),60vh)] overflow-auto";
const tocPanelFaceClasses =
  "rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg shadow-elevated p-[var(--radius-md)]";

export function FloatingTocContent({ className, ...props }: FloatingTocContentProps) {
  return (
    <FloatingTocContentHeadless
      {...props}
      className={cn(tocPanelBaseClasses, tocPanelFaceClasses, className)}
    />
  );
}

export function FloatingTocItem({ className, ...props }: FloatingTocItemProps) {
  return (
    <FloatingTocItemHeadless
      {...props}
      className={cn(itemBaseClasses, itemHoverClasses, itemActiveClasses, itemIndentClasses, className)}
    />
  );
}
