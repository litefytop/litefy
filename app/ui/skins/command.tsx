import { Command as CommandHeadless } from "@/ui";
import type { CommandProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";
import { dialogPartClasses } from "./dialog";
import { inputPartClasses } from "./input";
import { listClasses } from "./list";


const rootClasses = "flex flex-col gap-y-3";

const fieldSlots = { ...inputPartClasses, group: cn(inputPartClasses.group, "w-full") };

const triggerClasses = cn(buttonVariants.outline, "rounded-md px-control-x");

const panelClasses = cn(
  dialogPartClasses.content,
  "w-[min(32rem,calc(100vw-1rem))] max-w-none min-w-0 p-2",
  "[&_[data-command-hint]]:flex [&_[data-command-hint]]:items-center [&_[data-command-hint]]:gap-x-2 [&_[data-command-hint]]:text-xs [&_[data-command-hint]]:text-surface-fg",
  "[&_[data-command-hint-key]]:kbd",
);

const footerClasses = "flex items-center gap-x-3 border-t border-border pt-2";

const viewportClasses = cn(
  listClasses.viewport,
  "max-h-72 min-h-[8rem] rounded-none border-0 p-1",
);
const rowsClasses = cn(listClasses.root, "flex flex-col");
const itemClasses = cn(
  listClasses.item,
  "flex items-center gap-x-2 rounded-sm ",
);
const itemIconClasses = "shrink-0 text-surface-fg";

const searchIconClasses = "size-4";
const itemLabelClasses = "min-w-0 flex-1 truncate font-field data-disabled:opacity-50";

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
        label: cn(listClasses.groupHeader, "", classNames?.label),
        itemIcon: cn(itemIconClasses, classNames?.itemIcon),
        itemLabel: cn(itemLabelClasses, classNames?.itemLabel),
        shortcut: cn("kbd", classNames?.shortcut),
        footer: cn(footerClasses, classNames?.footer),
      }}
    />
  );
}
