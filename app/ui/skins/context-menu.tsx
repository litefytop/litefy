import {
  ContextMenuHost as ContextMenuHostHeadless,
  ContextMenu,
  useContextMenuTrigger,
} from "@/ui";
import type { ContextMenuClassNames } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { menuClasses } from "./menu";
import { popoverClasses } from "./popover";

export { ContextMenu, useContextMenuTrigger };


const SKIN: ContextMenuClassNames = {
  content: cn(popoverClasses.content, "w-48 p-[var(--radius-md)]"),
  root: menuClasses.root,
  item: menuClasses.item,
  label: menuClasses.label,
  itemButton: menuClasses.itemButton,
  sub: menuClasses.sub,
  chevron: menuClasses.chevron,
};

export function ContextMenuHost({
  classNames,
}: {
  classNames?: ContextMenuClassNames;
}) {
  return <ContextMenuHostHeadless classNames={mergeSlots(SKIN, classNames)} />;
}
