import { Accordion as AccordionHeadless } from "@/ui";
import type { AccordionProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { collapseDisabledItemClasses, collapseDisabledPartClasses, collapseFrameClasses, collapseItemClasses, collapsePartClasses, collapseRootClasses } from "./collapse";

export function Accordion({ className, common, items, disabled, ...props }: AccordionProps) {
  return (
    <AccordionHeadless
      {...props}
      disabled={disabled}
      className={cn(collapseRootClasses, className)}
      items={items.map((item) => {
        const itemDisabled = Boolean(disabled || item.disabled);
        const overrides = mergeSlots(common?.classNames ?? {}, item.classNames);
        return {
          ...item,
          disabled: itemDisabled,
          className: cn(
            collapseFrameClasses,
            collapseItemClasses,
            itemDisabled ? collapseDisabledItemClasses : undefined,
            common?.className,
            item.className,
          ),
          classNames: mergeSlots(itemDisabled ? collapseDisabledPartClasses : collapsePartClasses, overrides),
        };
      })}
      common={{ ...common, classNames: undefined }}
    />
  );
}
