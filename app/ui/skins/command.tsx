import { Command as CommandHeadless } from "@/ui";
import type { CommandProps } from "@/ui";
import { cn, mergeSlots, resolveSlotClassName, type SlotState } from "../utils/cn";
import { buttonSquareFieldClasses, buttonVariants } from "./button";
import { dialogPartClasses } from "./dialog";
import { listClasses, listOptionHoverClasses } from "./list";


const rootClasses = "flex w-full min-w-0 flex-col";

const fieldSlots = {
  group: "flex w-full min-h-control items-center gap-x-2 px-3",
  root: "min-w-0 grow basis-0 self-stretch border-0 bg-transparent p-0 outline-none font-field text-inherit placeholder:text-foreground",
  leading: "inline-flex shrink-0 items-center",
  trailing: "inline-flex min-w-0 shrink items-center overflow-hidden",
};

const triggerClasses = cn(buttonSquareFieldClasses, "px-control-x");
const triggerDisabledClasses = cn(buttonVariants.disabled, "rounded-md px-control-x");
const triggerClassesByState = (disabled: boolean) =>
  disabled ? triggerDisabledClasses : triggerClasses;

const panelClasses = cn(
  dialogPartClasses.content,
  "w-full min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))]",
);

const footerClasses = "flex items-center gap-x-3 border-t border-border pt-1";

const hintClasses = "flex items-center gap-x-2 text-xs text-foreground";

const hintKeyClasses = "kbd";

const viewportClasses = cn(
  "w-full min-w-0 overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>div]:block",
  "max-h-72 min-h-32 p-1",
);
const rowsClasses = cn(listClasses.root, "flex flex-col");
const itemLayoutClasses =
  "flex min-h-control select-none items-center gap-x-2 px-2 py-1.5 text-sm leading-5 font-field";

const itemClasses = cn(
  itemLayoutClasses,
  "cursor-pointer text-foreground",
  listOptionHoverClasses,
);

const itemDisabledClasses = cn(
  itemLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);

const itemClassesByState = ({ disabled }: SlotState) =>
  disabled ? itemDisabledClasses : itemClasses;
const itemIconClasses = "shrink-0 text-inherit";
const searchIconClasses = "size-4";
const itemLabelClasses = "min-w-0 flex-1 truncate font-field";
const labelClasses = "px-2 py-1.5 text-xs control-label text-foreground";

const emptyClasses = "flex min-h-30 items-center justify-center text-sm text-foreground";

export function Command({ classNames, ...props }: CommandProps) {
  return (
    <CommandHeadless
      {...props}
      dialogClassNames={{ root: dialogPartClasses.root, stage: dialogPartClasses.stage }}
      classNames={{
        ...classNames,
        trigger: cn(triggerClassesByState(props.disabled ?? false), classNames?.trigger),
        content: cn(panelClasses, classNames?.content),
        field: mergeSlots(fieldSlots, classNames?.field),
        searchIcon: cn(searchIconClasses, classNames?.searchIcon),
        root: cn(rootClasses, classNames?.root),
        list: cn(viewportClasses, classNames?.list),
        rows: cn(rowsClasses, classNames?.rows),
        item: (state) => cn(itemClassesByState(state), resolveSlotClassName(classNames?.item, state)),
        label: cn(labelClasses, classNames?.label),
        itemIcon: cn(itemIconClasses, classNames?.itemIcon),
        itemLabel: cn(itemLabelClasses, classNames?.itemLabel),
        shortcut: cn("kbd", classNames?.shortcut),
        empty: cn(emptyClasses, classNames?.empty),
        footer: cn(footerClasses, classNames?.footer),
        hint: cn(hintClasses, classNames?.hint),
        hintKey: cn(hintKeyClasses, classNames?.hintKey),
      }}
    />
  );
}
