import { DropdownMenu as DropdownMenuHeadless } from "@/ui";
import type { DropdownMenuProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";
import { popoverClasses, popoverTriggerDisabledClasses } from "./popover";
import { menuClasses, menuItemButtonClasses } from "./menu";


const triggerClassesByState = (disabled: boolean | undefined) =>
  disabled ? popoverTriggerDisabledClasses : popoverClasses.trigger;

export function DropdownMenu({
  className,
  itemClassName,
  classNames,
  disabled,
  ...props
}: DropdownMenuProps) {
  return (
    <DropdownMenuHeadless
      {...props}
      disabled={disabled}
      className={cn(triggerClassesByState(disabled), className)}
      itemClassName={itemClassName}
      classNames={{
        ...mergeStateSlots(
          {
            itemButton: (state: SlotState) => menuItemButtonClasses(state),
            item: menuClasses.item,
            label: menuClasses.label,
            sub: menuClasses.sub,
            chevron: menuClasses.chevron,
          },
          classNames,
        ),
        content: cn(popoverClasses.content, "w-48 min-w-0 p-[var(--radius-md)]", classNames?.content),
        menuRoot: cn(menuClasses.root, classNames?.menuRoot),
      }}
    />
  );
}
