import { List as ListHeadless, Order as OrderHeadless } from "@/ui";
import type { ListProps, OrderProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";


const listSizeClasses = {
  sm: "max-w-[20rem]",
  md: "max-w-[24rem]",
  lg: "max-w-[28rem]",
  xl: "max-w-[32rem]",
};

export const listViewportClasses =
  "w-full min-w-0 overflow-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
  "[&_ol]:m-0 [&_ol]:list-none [&_ol]:p-0 [&_ul]:m-0 [&_ul]:list-none [&_ul]:p-0 [&>div]:block";

export const listFrameClasses = "rounded-md border-frame border-border shadow-frame";

const rootClasses =
  "m-0 p-0 list-none data-[ordered]:list-decimal data-[ordered]:ps-6";

const itemBaseClasses =
  "px-3 py-snug border-b-hair border-border text-sm leading-5 font-field text-foreground " +
  "cursor-pointer last:border-b-0";
export const listOptionHoverClasses =
  "hover:bg-accent hover:text-accent-fg data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-fg";

const itemClasses = cn(itemBaseClasses, listOptionHoverClasses);

const itemDisabledClasses = cn(
  itemBaseClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);

export const listItemClasses = ({ disabled }: SlotState) =>
  disabled ? itemDisabledClasses : itemClasses;

const emptyClasses = "px-3 py-2 text-sm leading-5 text-foreground";

const groupsClasses = "outline-none";

const groupHeaderClasses =
  "px-3 py-snug border-b-hair border-border text-sm leading-5 control-label ";

export const listPartClasses = {
  item: (state: SlotState) => listItemClasses(state),
  groupHeader: groupHeaderClasses,
};

export const listClasses = {
  viewport: cn(listViewportClasses, listFrameClasses, listSizeClasses.lg),
  root: rootClasses,
  item: itemClasses,
  empty: emptyClasses,
  groups: groupsClasses,
  groupHeader: groupHeaderClasses,
};

export function List<T>({ size = "lg", className, classNames, ...props }: ListProps<T>) {
  const { viewport: viewportOverride, ...slots } = classNames ?? {};
  return (
    <ListHeadless
      {...props}
      size={size}
      className={cn(listClasses.viewport, listSizeClasses[size], viewportOverride, className)}
      classNames={mergeStateSlots(
        { root: rootClasses, item: listItemClasses, empty: emptyClasses, groups: groupsClasses, groupHeader: groupHeaderClasses },
        slots,
      )}
    />
  );
}

export function Order<T>({ size = "lg", className, classNames, ...props }: OrderProps<T>) {
  const { viewport: viewportOverride, ...slots } = classNames ?? {};
  return (
    <OrderHeadless
      {...props}
      size={size}
      className={cn(listClasses.viewport, listSizeClasses[size], viewportOverride, className)}
      classNames={mergeStateSlots(
        { root: rootClasses, item: listItemClasses, empty: emptyClasses, groupHeader: groupHeaderClasses },
        slots,
      )}
    />
  );
}
