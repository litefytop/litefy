import { Accordion as AccordionHeadless } from "@/ui";
import type { AccordionProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { collapseItemClasses, collapsePartClasses, collapseRootClasses } from "./collapse";

export function Accordion({ className, common, items, ...props }: AccordionProps) {
  return (
    <AccordionHeadless
      {...props}
      className={cn(collapseRootClasses, className)}
      items={items.map((item) => ({ ...item, className: cn(collapseRootClasses, collapseItemClasses, common?.className, item.className) }))}
      common={{ ...common, classNames: mergeSlots(collapsePartClasses, common?.classNames) }}
    />
  );
}
