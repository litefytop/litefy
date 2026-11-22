import { Menu as MenuHeadless } from "@/ui";
import type { MenuProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "m-0 p-0 list-none inert:dim";

const itemClasses =
  "m-0 not-last:border-b-hair not-last:border-border";

const labelClasses =
  "m-0 not-last:border-b-hair not-last:border-border " +
  "px-3 py-snug text-sm leading-5 font-label tracking-label case-label text-surface-fg";

const itemButtonBaseClasses =
  "block w-full text-left px-3 py-snug text-sm leading-5 text-foreground cursor-pointer disabled:dim not-data-[has-sub]:truncate";
const itemButtonPressClasses = "active:crush";
const itemButtonSubClasses =
  "data-[has-sub]:flex data-[has-sub]:items-center data-[has-sub]:justify-between data-[has-sub]:cursor-default";

const itemButtonClasses = cn(itemButtonBaseClasses, itemButtonPressClasses, itemButtonSubClasses);

const subClasses =
  "w-48 rounded-md border-frame border-border " +
  "bg-surface-raised text-foreground shadow-elevated p-[var(--radius-md)]";

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
