import { Tree as TreeHeadless } from "@/ui";
import type { TreeProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";


const depthEval =
  "[--litefy-indent:calc(var(--spacing)_*_4_+_var(--spacing)_*_2_*_var(--litefy-depth,0))]";
const depthStart = `ps-(--litefy-indent) ${depthEval}`;

const listClasses = "[--litefy-depth:0] m-0 flex w-full min-w-0 list-none flex-col p-0";

const itemMarkerClasses =
  "before:absolute before:inset-y-2 before:w-px before:bg-transparent" +
  " before:left-[calc(var(--spacing)_*_4_+_var(--spacing)_*_2_*_var(--litefy-depth,0)_-_var(--spacing)_*_2)]";
const itemActiveClasses =
  "data-[active=true]:bg-primary data-[active=true]:text-primary-fg data-[active=true]:hover:bg-primary-accent";
const rowHoverClasses = "hover:bg-accent hover:text-accent-fg";

const rowClasses =
  `relative flex min-h-control w-full min-w-0 items-center gap-x-2 ` +
  `text-start text-sm leading-body font-field no-underline ` +
  `focus-visible:focus-ring ` +
  `pe-3 py-2 ${depthStart}`;

const triggerClasses = cn(
  rowClasses,
  "cursor-pointer text-foreground",
  rowHoverClasses,
);
const triggerDisabledClasses = cn(
  rowClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);
const itemClasses = cn(
  rowClasses,
  itemMarkerClasses,
  "cursor-pointer text-foreground",
  rowHoverClasses,
  itemActiveClasses,
);
const itemDisabledClasses = cn(
  rowClasses,
  itemMarkerClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);
const rowClassesByState = (normal: string, disabled: string) =>
  ({ disabled: isDisabled }: SlotState) => isDisabled ? disabled : normal;

const treeClasses = {
  trigger: rowClassesByState(triggerClasses, triggerDisabledClasses),

  item: rowClassesByState(itemClasses, itemDisabledClasses),
  label:
    "pt-4 pb-1 pe-3 text-xs leading-body control-label text-foreground " +
    depthStart,
  group:
    `${listClasses} transition-[visibility] duration-md ease-frame ` +
    "[[data-open=false]_&]:invisible",
  node: "min-w-0",
  clip: "min-w-0",
  branch:
    "relative transition-[grid-template-rows] duration-md ease-frame" +
    " before:absolute before:z-10 before:content-[''] before:inset-y-1 before:w-px" +
    " before:bg-border" +
    " before:left-(--litefy-indent) " +
    depthEval,
  icon:
    "inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-full" +
    " data-[open]:transition-transform data-[open]:duration-md data-[open]:ease-frame" +
    " data-[open=true]:rotate-90",
  labelText: "flex-1 min-w-0 truncate",
};

export function Tree({ className, classNames, ...props }: TreeProps) {
  return (
    <TreeHeadless
      {...props}
      className={cn(listClasses, className)}
      classNames={mergeStateSlots(treeClasses, classNames)}
    />
  );
}
