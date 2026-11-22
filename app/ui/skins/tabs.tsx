import { Tabs as TabsHeadless } from "@/ui";
import type { TabsProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "flex w-full data-[orientation=horizontal]:flex-col data-[orientation=vertical]:flex-row";

const listBaseClasses = "group flex min-w-0 items-center gap-x-2 border-b-frame border-b-border";
const listVerticalLayoutClasses =
  "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-b-0";
const listVerticalBorderClasses =
  "data-[orientation=vertical]:border-r-frame data-[orientation=vertical]:border-r-border";

const listClasses = cn(listBaseClasses, listVerticalLayoutClasses, listVerticalBorderClasses);


const scrollerClasses =
  "flex min-w-0 flex-1 items-center gap-x-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const scrollClasses =
  "hidden min-h-control min-w-control shrink-0 cursor-pointer items-center justify-center rounded-md " +
  "text-surface-fg group-data-[overflow=true]:flex [&>svg]:shrink-0";

const triggerBaseClasses =
  "flex min-h-control cursor-pointer items-center border-b-hair border-b-transparent px-4 py-2";
const triggerTextClasses =
  "text-sm leading-5 font-label tracking-label case-label whitespace-nowrap text-surface-fg";
const triggerStateClasses =
  "hover:not-disabled:bg-accent hover:not-disabled:text-accent-fg disabled:dim " +
  "data-[state=active]:text-primary data-[state=active]:border-b-primary";

const triggerClasses = cn(triggerBaseClasses, triggerTextClasses, triggerStateClasses);


const contentClasses = "w-full rounded-lg p-4 text-base leading-body";

const triggerPrimaryBaseClasses =
  "flex min-h-control cursor-pointer items-center rounded-md px-4 py-2";
const triggerPrimaryTextClasses =
  "text-sm leading-5 font-label tracking-label case-label whitespace-nowrap";
const triggerPrimaryInactiveClasses =
  "data-[state=inactive]:text-surface-fg disabled:dim " +
  "data-[state=inactive]:hover:not-disabled:bg-accent data-[state=inactive]:hover:not-disabled:text-accent-fg";
const triggerPrimaryActiveClasses =
  "data-[state=active]:bg-primary data-[state=active]:text-primary-fg";

const triggerPrimaryClasses = cn(
  triggerPrimaryBaseClasses,
  triggerPrimaryTextClasses,
  triggerPrimaryInactiveClasses,
  triggerPrimaryActiveClasses,
);

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
