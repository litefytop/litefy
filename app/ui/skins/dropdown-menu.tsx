import { DropdownMenu as DropdownMenuHeadless } from "@/ui";
import type { DropdownMenuProps } from "@/ui";
import { cn } from "../utils/cn";
import { panelPadClass, popoverClasses } from "./popover";
import { menuClasses } from "./menu";


export function DropdownMenu({
  className,
  itemClassName,
  classNames,
  ...props
}: DropdownMenuProps) {
  return (
    <DropdownMenuHeadless
      {...props}
      className={cn(popoverClasses.trigger, className)}
      itemClassName={cn(menuClasses.itemButton, itemClassName)}
      classNames={{
        content: cn(popoverClasses.content, "w-48", panelPadClass, classNames?.content),
        menuRoot: cn(menuClasses.root, classNames?.menuRoot),
        item: cn(menuClasses.item, classNames?.item),
        label: cn(menuClasses.label, classNames?.label),
        sub: cn(menuClasses.sub, classNames?.sub),
        chevron: cn(menuClasses.chevron, classNames?.chevron),
      }}
    />
  );
}
