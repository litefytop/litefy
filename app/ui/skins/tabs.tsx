import { Tabs as TabsHeadless } from "@/ui";
import type { TabsProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "flex w-full data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row";

const listClasses =
  "group flex min-w-0 items-center gap-x-2 border-b-frame border-b-border " +
  "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch " +
  "data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r-frame data-[orientation=vertical]:border-r-border";


const scrollerClasses =
  "flex min-w-0 flex-1 items-center gap-x-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const scrollClasses =
  "hidden min-h-control min-w-control shrink-0 cursor-pointer items-center justify-center rounded-md " +
  "text-surface-fg group-data-[overflow=true]:flex " +
  "disabled:cursor-default disabled:opacity-50 [&>svg]:shrink-0";

const triggerClasses =
  "flex min-h-control cursor-pointer items-center border-b-hair border-b-transparent px-4 py-2 " +
  "text-sm leading-5 font-label tracking-label case-label whitespace-nowrap text-surface-fg " +
  "hover:not-disabled:bg-accent hover:not-disabled:text-accent-fg " +
  "data-[state=active]:text-primary data-[state=active]:border-b-primary";


const contentClasses = "w-full rounded-lg p-4 text-base leading-body";

const triggerPrimaryClasses =
  "flex min-h-control cursor-pointer items-center rounded-md px-4 py-2 " +
  "text-sm leading-5 font-label tracking-label case-label whitespace-nowrap " +
  "data-[state=inactive]:text-surface-fg " +
  "data-[state=inactive]:hover:not-disabled:bg-accent data-[state=inactive]:hover:not-disabled:text-accent-fg " +
  "data-[state=active]:bg-primary data-[state=active]:text-primary-fg";

const listPrimaryClasses = cn(listClasses, "border-b-0 border-r-0 gap-x-1");

export interface TabsSkinProps extends TabsProps {
  variant?: "line" | "primary";
}

const tabsSlots = (variant: "line" | "primary") => ({
  root: rootClasses,
  list: variant === "primary" ? listPrimaryClasses : listClasses,
  scroller: scrollerClasses,
  scroll: scrollClasses,
  trigger: variant === "primary" ? triggerPrimaryClasses : triggerClasses,
  content: contentClasses,
});

export function Tabs({ variant = "line", classNames, ...props }: TabsSkinProps) {
  return (
    <TabsHeadless
      {...props}
      data-variant={variant}
      classNames={mergeSlots(tabsSlots(variant), classNames)}
    />
  );
}
