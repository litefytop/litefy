import { List as ListHeadless, Order as OrderHeadless } from "@/ui";
import type { ListProps, OrderProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


export const listViewportClasses =
  "overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
  "[&_ol]:m-0 [&_ol]:list-none [&_ol]:p-0 [&_ul]:m-0 [&_ul]:list-none [&_ul]:p-0 [&>div]:block";

export const listFrameClasses = "rounded-md border-frame border-border shadow-frame";

const rootClasses =
  "m-0 p-0 list-none cursor-not-allowed data-[ordered]:list-decimal data-[ordered]:ps-6";

const itemBaseClasses =
  "px-3 py-snug border-b-hair border-border text-sm leading-5 font-field text-foreground " +
  "cursor-pointer last:border-b-0";
const itemHoverClasses =
  "hover:bg-accent hover:text-accent-fg " +
  "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-fg " +
  "data-[disabled]:dim";

const itemClasses = cn(itemBaseClasses, itemHoverClasses);

const emptyClasses = "px-3 py-2 text-sm leading-5 text-surface-fg";

const groupsClasses = "outline-none";

const groupHeaderClasses =
  "px-3 py-snug border-b-hair border-border text-sm leading-5 font-label tracking-label case-label ";

export const listPartClasses = { item: itemClasses, groupHeader: groupHeaderClasses };

export const listClasses = {
  viewport: cn(listViewportClasses, listFrameClasses),
  root: rootClasses,
  item: itemClasses,
  empty: emptyClasses,
  groups: groupsClasses,
  groupHeader: groupHeaderClasses,
};

export function List<T>({ className, classNames, ...props }: ListProps<T>) {
  return (
    <ListHeadless
      {...props}
      className={cn(listClasses.viewport, className)}
      classNames={mergeSlots(
        { root: rootClasses, item: itemClasses, empty: emptyClasses, groups: groupsClasses, groupHeader: groupHeaderClasses },
        classNames,
      )}
    />
  );
}

export function Order<T>({ className, classNames, ...props }: OrderProps<T>) {
  return (
    <OrderHeadless
      {...props}
      className={cn(listClasses.viewport, className)}
      classNames={mergeSlots(
        { root: rootClasses, item: itemClasses, empty: emptyClasses, groupHeader: groupHeaderClasses },
        classNames,
      )}
    />
  );
}
