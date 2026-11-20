import { Menu as MenuHeadless } from "@/ui";
import type { MenuProps } from "@/ui";
import { panelPadClass } from "./popover";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "m-0 p-0 list-none";

const itemClasses =
  "m-0 not-last:border-b-hair not-last:border-border";

const labelClasses =
  "m-0 not-last:border-b-hair not-last:border-border " +
  "px-3 py-snug text-sm leading-5 font-label tracking-label case-label text-surface-fg";

const itemButtonClasses =
  "block w-full text-left px-3 py-snug text-sm leading-5 " +
  "text-foreground cursor-pointer not-data-[has-sub]:truncate " +
  "" +
  "active:crush " +
  "data-[has-sub]:flex data-[has-sub]:items-center data-[has-sub]:justify-between data-[has-sub]:cursor-default " +
  "" +
  "disabled:opacity-50 disabled:cursor-default";

const subClasses =
  "w-48 rounded-xl border-frame border-border " +
  "bg-surface-raised text-foreground shadow-elevated " +
  panelPadClass;

const chevronClasses = "size-4 shrink-0 text-surface-fg";


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
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        { item: itemClasses, label: labelClasses, sub: subClasses, chevron: chevronClasses },
        classNames,
      )}
      itemClassName={cn(itemButtonClasses, itemClassName) || undefined}
    />
  );
}
