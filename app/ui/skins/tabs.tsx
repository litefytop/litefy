import { Tabs as TabsHeadless } from "@/ui";
import type { TabsOrientation, TabsProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";

const rootHorizontalClasses = "flex w-full min-w-0 flex-col";
const rootVerticalClasses = "flex w-full min-w-0 flex-row";

const listLineHorizontalClasses =
  "group flex min-w-0 items-center gap-x-2 border-b-frame border-b-border";
const listLineVerticalClasses =
  "group flex min-w-0 flex-col items-stretch gap-x-2 border-r-frame border-r-border";
const listPrimaryHorizontalClasses = cn(listLineHorizontalClasses, "border-b-0 gap-x-1");
const listPrimaryVerticalClasses = cn(listLineVerticalClasses, "border-r-0 gap-x-1");

const scrollerClasses =
  "flex min-w-0 flex-1 items-center gap-x-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const scrollLayoutClasses =
  "hidden min-h-control min-w-control shrink-0 items-center justify-center rounded-md " +
  "group-data-[overflow=true]:flex [&>svg]:shrink-0";
const scrollClasses = cn(
  scrollLayoutClasses,
  "cursor-pointer text-foreground",
);
const scrollDisabledClasses = cn(
  scrollLayoutClasses,
  "cursor-not-allowed text-disabled-fg",
);
const scrollClassesByState = ({ disabled }: SlotState) =>
  disabled ? scrollDisabledClasses : scrollClasses;

const triggerLayoutClasses =
  "flex min-h-control items-center border-b-hair border-b-transparent px-4 py-2";
const triggerTextClasses =
  "text-sm/5 control-label text-nowrap text-foreground";
const triggerStateClasses =
  "data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-fg " +
  "data-[state=active]:text-primary data-[state=active]:border-b-primary";

const triggerClasses = cn(
  triggerLayoutClasses,
  "cursor-pointer",
  triggerTextClasses,
  triggerStateClasses,
);

const triggerDisabledClasses = cn(
  triggerLayoutClasses,
  "cursor-not-allowed text-disabled-fg",
);

const contentClasses = "w-full rounded-lg p-4 text-base leading-body";

const triggerPrimaryLayoutClasses =
  "flex min-h-control items-center rounded-md px-4 py-2";
const triggerPrimaryTextClasses =
  "text-sm leading-5 control-label text-nowrap";
const triggerPrimaryInactiveClasses =
  "data-[state=inactive]:text-foreground data-[state=inactive]:hover:bg-accent " +
  "data-[state=inactive]:hover:text-accent-fg";
const triggerPrimaryActiveClasses =
  "data-[state=active]:bg-primary data-[state=active]:text-primary-fg";

const triggerPrimaryClasses = cn(
  triggerPrimaryLayoutClasses,
  "cursor-pointer",
  triggerPrimaryTextClasses,
  triggerPrimaryInactiveClasses,
  triggerPrimaryActiveClasses,
);

const triggerPrimaryDisabledClasses = cn(
  triggerPrimaryLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);

const tabsClassesByState = (
  variant: "line" | "primary",
  { disabled }: SlotState,
) => disabled
  ? variant === "primary" ? triggerPrimaryDisabledClasses : triggerDisabledClasses
  : variant === "primary" ? triggerPrimaryClasses : triggerClasses;

export interface TabsSkinProps extends TabsProps {
  variant?: "line" | "primary";
}

const tabsSlots = (variant: "line" | "primary", orientation: TabsOrientation) => {
  const vertical = orientation === "vertical";
  const listClasses = vertical ? listLineVerticalClasses : listLineHorizontalClasses;
  const listPrimaryClasses = vertical ? listPrimaryVerticalClasses : listPrimaryHorizontalClasses;
  return {
    root: vertical ? rootVerticalClasses : rootHorizontalClasses,
    list: variant === "primary" ? listPrimaryClasses : listClasses,
    scroller: scrollerClasses,
    scroll: scrollClassesByState,
    trigger: (state: SlotState) => tabsClassesByState(variant, state),
    content: contentClasses,
  };
};

export function Tabs({ variant = "line", orientation = "horizontal", className, classNames, ...props }: TabsSkinProps) {
  return (
    <TabsHeadless
      {...props}
      orientation={orientation}
      data-variant={variant}
      classNames={mergeStateSlots(tabsSlots(variant, orientation), { ...classNames, root: cn(className, classNames?.root) })}
    />
  );
}