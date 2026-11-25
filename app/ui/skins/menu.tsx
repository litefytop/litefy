import { Menu as MenuHeadless } from "@/ui";
import type { MenuProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";
import { popoverWidthClasses } from "./popover";


const rootClasses = "m-0 p-0 list-none text-foreground";

const itemClasses =
  "m-0 not-last:border-b-hair not-last:border-border";

const labelClasses =
  "m-0 not-last:border-b-hair not-last:border-border " +
  "px-3 py-snug text-sm leading-5 control-label text-foreground";

const itemButtonBaseClasses =
  "block w-full text-left px-3 py-snug text-sm/5 not-data-has-sub:truncate";
const itemButtonPressClasses = "active:crush";
const itemButtonSubClasses =
  "data-has-sub:flex data-has-sub:items-center data-has-sub:justify-between";

const itemButtonClasses = cn(
  itemButtonBaseClasses,
  itemButtonPressClasses,
  itemButtonSubClasses,
  "cursor-pointer data-has-sub:cursor-default " +
    "hover:bg-accent hover:text-accent-fg data-active:bg-accent data-active:text-accent-fg",
);

const itemButtonDisabledClasses = cn(
  itemButtonBaseClasses,
  itemButtonSubClasses,
  "cursor-not-allowed text-disabled-fg",
);

export const menuItemButtonClasses = ({ disabled }: SlotState) =>
  disabled ? itemButtonDisabledClasses : itemButtonClasses;

const subClasses = cn(
  popoverWidthClasses,
  "rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg shadow-elevated p-[var(--radius-md)]",
);

const chevronClasses = "size-4 shrink-0 text-foreground";


export const menuClasses = {
  root: rootClasses,
  item: itemClasses,
  label: labelClasses,
  itemButton: itemButtonClasses,
  sub: subClasses,
  chevron: chevronClasses,
};

export function Menu({
  className,
  classNames,
  itemClassName,
  ...props
}: MenuProps) {
  return (
    <MenuHeadless
      {...props}
      classNames={mergeStateSlots(
        { item: itemClasses, label: labelClasses, sub: subClasses, chevron: chevronClasses, itemButton: menuItemButtonClasses },
        { ...classNames, root: cn(rootClasses, classNames?.root, className) },
      )}
      itemClassName={itemClassName || undefined}
    />
  );
}
