import { Command as CommandHeadless } from "@/ui";
import type { CommandProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";
import { dialogPartClasses } from "./dialog";
import { panelPadClass } from "./popover";
import { listClasses } from "./list";


const rootClasses = "flex flex-col";

const fieldSlots = {
  group: "flex w-full min-h-control items-center gap-x-2 px-3",
  root: "min-w-0 grow basis-0 self-stretch border-0 bg-transparent p-0 outline-none font-field text-inherit placeholder:text-surface-fg",
  leading: "inline-flex shrink-0 items-center",
  trailing: "inline-flex min-w-0 shrink items-center overflow-hidden",
};

const triggerClasses = cn(buttonVariants.outline, "rounded-md px-control-x");

const panelClasses = cn(
  dialogPartClasses.content,
  "w-[min(--spacing(128),calc(100vw_-_--spacing(4)))] max-w-none min-w-0",
  panelPadClass,
  "[&_[data-command-hint]]:flex [&_[data-command-hint]]:items-center [&_[data-command-hint]]:gap-x-2 [&_[data-command-hint]]:text-xs [&_[data-command-hint]]:text-surface-fg",
  "[&_[data-command-hint-key]]:kbd",
);

const footerClasses = "flex items-center gap-x-3 border-t border-border pt-1";

const viewportClasses = cn(
  listClasses.viewport,
  "max-h-72 min-h-32 rounded-none border-0 shadow-none p-1",
);
const rowsClasses = cn(listClasses.root, "flex flex-col");
const itemClasses =
  "flex min-h-control cursor-pointer select-none items-center gap-x-2 px-2 py-1.5 text-sm leading-5 font-field text-foreground " +
  "hover:bg-accent hover:text-accent-fg data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-fg";
const itemIconClasses = "shrink-0 text-surface-fg";
const searchIconClasses = "size-4";
const itemLabelClasses = "min-w-0 flex-1 truncate font-field data-disabled:opacity-50";
const labelClasses = "px-2 py-1.5 text-xs font-label tracking-label case-label text-surface-fg";

const emptyClasses = "flex min-h-30 items-center justify-center text-sm text-surface-fg";

export function Command({ classNames, ...props }: CommandProps) {
  return (
    <CommandHeadless
      {...props}
      dialogClassNames={{ root: dialogPartClasses.root, stage: dialogPartClasses.stage }}
      classNames={{
        ...classNames,
        trigger: cn(triggerClasses, classNames?.trigger),
        content: cn(panelClasses, classNames?.content),
        field: mergeSlots(fieldSlots, classNames?.field),
        searchIcon: cn(searchIconClasses, classNames?.searchIcon),
        root: cn(rootClasses, classNames?.root),
        list: cn(viewportClasses, classNames?.list),
        rows: cn(rowsClasses, classNames?.rows),
        item: cn(itemClasses, classNames?.item),
        label: cn(labelClasses, classNames?.label),
        itemIcon: cn(itemIconClasses, classNames?.itemIcon),
        itemLabel: cn(itemLabelClasses, classNames?.itemLabel),
        shortcut: cn("kbd", classNames?.shortcut),
        empty: cn(emptyClasses, classNames?.empty),
        footer: cn(footerClasses, classNames?.footer),
      }}
    />
  );
}
