import {
  ContextMenuHost as ContextMenuHostHeadless,
  ContextMenu,
  useContextMenuTrigger,
  type ContextMenuClassNames,
} from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";
import { menuClasses, menuItemButtonClasses } from "./menu";
import { popoverClasses } from "./popover";

export { ContextMenu, useContextMenuTrigger };


const SKIN = {
  content: cn(popoverClasses.content, "w-48 min-w-0 p-[var(--radius-md)]"),
  root: menuClasses.root,
  item: menuClasses.item,
  label: menuClasses.label,
  itemButton: (state: SlotState) => menuItemButtonClasses(state),
  sub: menuClasses.sub,
  chevron: menuClasses.chevron,
};

export function ContextMenuHost({
  classNames,
}: {
  classNames?: ContextMenuClassNames;
}) {
  return <ContextMenuHostHeadless classNames={mergeStateSlots(SKIN, classNames)} />;
}
