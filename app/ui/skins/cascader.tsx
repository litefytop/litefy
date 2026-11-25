import { Cascader as CascaderHeadless } from "@/ui";
import type { CascaderProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { listClasses, listViewportClasses } from "./list";
import { popoverClasses } from "./popover";


const rootClasses =
  "w-full min-w-0 max-w-[20rem] rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg text-sm leading-5 shadow-base focus-within:focus-ring";

const rootDisabledClasses =
  "w-full min-w-0 max-w-[20rem] rounded-md border-frame border-border bg-disabled text-sm leading-5 text-disabled-fg shadow-base";

const breadcrumbClasses = "w-full min-w-0 overflow-x-auto";

const triggerBaseClasses =
  "w-full min-w-0 min-h-control px-3 py-2 text-left truncate tracking-normal";
const triggerClasses = cn(
  triggerBaseClasses,
  "aria-[current=step]:font-strong aria-[current=step]:text-foreground",
  "cursor-pointer text-foreground",
);

const triggerDisabledClasses = cn(
  triggerBaseClasses,
  "cursor-not-allowed text-disabled-fg",
);

const chevronClasses = "size-3.5 shrink-0 text-foreground";

const menuClasses = cn(popoverClasses.content, "p-[var(--radius-md)]");

const optionClasses = "flex items-center justify-between gap-x-2";

const listClassesInPanel = {
  ...listClasses,
  viewport: cn(listViewportClasses, "w-full max-h-56"),
};

export function Cascader({ className, classNames, disabled, ...props }: CascaderProps) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  const root = disabled ? rootDisabledClasses : rootClasses;
  return (
    <CascaderHeadless
      {...props}
      disabled={disabled}
      classNames={{
        ...mergeSlots(
          {
            root: cn(root, rootOverride, className),
            breadcrumb: breadcrumbClasses,
            trigger: disabled ? triggerDisabledClasses : triggerClasses,
            chevron: chevronClasses,
            menu: menuClasses,
            option: optionClasses,
          },
          slots,
        ),
        list: mergeSlots(listClassesInPanel, classNames?.list),
      }}
    />
  );
}
