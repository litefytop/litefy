import { Cascader as CascaderHeadless } from "@/ui";
import type { CascaderProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { listClasses, listViewportClasses } from "./list";
import { panelPadClass, popoverClasses } from "./popover";


const rootClasses =
  "rounded-md border-frame border-border bg-background text-sm leading-5 shadow-base focus-within:focus-ring";

const breadcrumbClasses = "w-full min-w-0 overflow-x-auto";

const triggerClasses =
  "w-full min-w-0 min-h-control px-3 py-2 text-left truncate " +
  "cursor-pointer text-surface-fg tracking-normal " +
  "hover:text-accent-fg " +
  "aria-[current=step]:font-strong aria-[current=step]:text-foreground";

const chevronClasses = "size-3.5 shrink-0 text-surface-fg";

const menuClasses = cn(popoverClasses.content, panelPadClass);

const optionClasses = "flex items-center justify-between gap-x-2";

const listClassesInPanel = {
  ...listClasses,
  viewport: cn(listViewportClasses, "w-full max-h-56"),
};

export function Cascader({ className, classNames, ...props }: CascaderProps) {
  return (
    <CascaderHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={{
        ...mergeSlots(
          {
            root: rootClasses,
            breadcrumb: breadcrumbClasses,
            trigger: triggerClasses,
            chevron: chevronClasses,
            menu: menuClasses,
            option: optionClasses,
          },
          classNames,
        ),
        list: mergeSlots(listClassesInPanel, classNames?.list),
      }}
    />
  );
}
