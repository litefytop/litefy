import { Collapse as CollapseHeadless } from "@/ui";
import type { CollapseProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


export const collapseFrameClasses =
  "group flex w-full min-w-0 flex-col overflow-hidden rounded-md border-frame border-border";

export const collapseRootClasses = cn(
  collapseFrameClasses,
  "bg-surface-raised text-surface-raised-fg shadow-surface " +
    "data-[disabled=true]:bg-disabled data-[disabled=true]:text-disabled-fg",
);


export const collapseItemClasses =
  "flex flex-col overflow-hidden rounded-none border-0 not-last:border-b-hair not-last:border-border";

export const collapseDisabledItemClasses = "bg-disabled";

const triggerBaseClasses =
  "flex min-h-control items-center justify-between gap-x-2 px-3 py-3 text-left " +
  "text-sm font-label leading-label tracking-label case-label";
const triggerHoverClasses =
  "cursor-pointer aria-[expanded=false]:hover:bg-accent aria-[expanded=false]:hover:text-accent-fg focus-visible:focus-ring";

const triggerClasses = cn(triggerBaseClasses, triggerHoverClasses);

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

export const collapseDisabledPartClasses = {
  trigger: cn(triggerBaseClasses, "cursor-not-allowed text-disabled-fg"),
  icon: iconClasses,
  panel: panelClasses,
  body: cn(bodyClasses, "text-disabled-fg"),
};

export function Collapse({ className, classNames, disabled, ...props }: CollapseProps) {
  return (
    <CollapseHeadless
      {...props}
      disabled={disabled}
      className={cn(collapseRootClasses, className)}
      classNames={mergeSlots(disabled ? collapseDisabledPartClasses : collapsePartClasses, classNames)}
    />
  );
}
