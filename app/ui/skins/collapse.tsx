import { Collapse as CollapseHeadless } from "@/ui";
import type { CollapseProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


export const collapseRootClasses =
  "group flex flex-col overflow-hidden rounded-md border-frame border-border shadow-surface";


export const collapseItemClasses =
  "flex flex-col overflow-hidden rounded-none border-0 not-last:border-b-hair not-last:border-border";

const triggerClasses =
  "flex min-h-control cursor-pointer items-center justify-between gap-x-2 px-3 py-3 text-left text-sm font-label leading-label tracking-label case-label " +
  "aria-[expanded=false]:hover:bg-accent aria-[expanded=false]:hover:text-accent-fg " +
  "focus-visible:focus-ring";

const iconClasses =
  "size-4 flex-none transition-transform ease-frame duration-md " +
  "group-data-[duration=sm]:duration-sm group-data-[duration=lg]:duration-lg " +
  "data-[open=true]:-rotate-180";

const panelClasses =
  "transition-[grid-template-rows] ease-frame duration-md " +
  "group-data-[duration=sm]:duration-sm group-data-[duration=lg]:duration-lg";

const bodyClasses =
  "border-t-hair border-border p-4 text-sm leading-body font-medium";

export const collapsePartClasses = { trigger: triggerClasses, icon: iconClasses, panel: panelClasses, body: bodyClasses };

export function Collapse({ className, classNames, ...props }: CollapseProps) {
  return (
    <CollapseHeadless
      {...props}
      className={cn(collapseRootClasses, className)}
      classNames={mergeSlots(collapsePartClasses, classNames)}
    />
  );
}
