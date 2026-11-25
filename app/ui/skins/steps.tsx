import { Steps as StepsHeadless } from "@/ui";
import type { StepsClassNames, StepsOrientation, StepsProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";

const rootHorizontalClasses = "m-0 list-none p-0 flex w-full min-w-0 items-start text-foreground";
const rootVerticalClasses = "m-0 list-none p-0 flex w-full min-w-0 flex-col items-stretch text-foreground";

export function stepsRootClasses(orientation: StepsOrientation = "horizontal") {
  return orientation === "vertical" ? rootVerticalClasses : rootHorizontalClasses;
}

const markerLayoutClasses =
  "relative z-1 grid size-6 shrink-0 place-center rounded-pill " +
  "border-frame text-xs/4 font-strong [&>svg]:size-3.5";
const markerUpcomingClasses =
  "data-[state=upcoming]:bg-transparent data-[state=upcoming]:text-inherit " +
  "data-[state=upcoming]:hover:bg-accent";

const markerClasses = cn(
  markerLayoutClasses,
  "bg-primary text-primary-fg cursor-pointer",
  "hover:bg-primary-accent thumb-hit",
  markerUpcomingClasses,
);

const markerDisabledClasses = cn(
  markerLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg shadow-frame-disabled",
);

const markerClassesByState = ({ disabled }: SlotState) =>
  disabled ? markerDisabledClasses : markerClasses;

const railClasses = "flex shrink-0 flex-col items-center";

const connectorHorizontalClasses =
  "absolute top-3 right-[calc(50%+var(--spacing)*3)] left-[calc(-50%+var(--spacing)*3)] " +
  "h-px bg-primary data-[state=upcoming]:bg-well";
const connectorVerticalClasses =
  "w-px flex-1 bg-primary data-[state=upcoming]:bg-well";

const titleBaseClasses =
  "control-label data-[state=upcoming]:text-foreground data-[clickable=true]:cursor-pointer";
const titleHorizontalClasses = cn(titleBaseClasses, "text-xs leading-none text-center");
const titleVerticalClasses = cn(titleBaseClasses, "text-start text-sm leading-none");
const titleDisabledHorizontalClasses = "control-label cursor-not-allowed text-xs leading-none text-center text-disabled-fg";
const titleDisabledVerticalClasses = "control-label cursor-not-allowed text-start text-sm leading-none text-disabled-fg";

const titleClassesByState = (
  vertical: boolean,
  { disabled }: SlotState,
) => disabled
  ? vertical ? titleDisabledVerticalClasses : titleDisabledHorizontalClasses
  : vertical ? titleVerticalClasses : titleHorizontalClasses;

const descriptionBaseClasses = "font-field text-foreground";
const descriptionHorizontalClasses = cn(descriptionBaseClasses, "text-xs leading-none text-center");
const descriptionVerticalClasses = cn(descriptionBaseClasses, "text-xs leading-4");

const itemHorizontalClasses = "m-0 relative flex flex-1 flex-col items-center gap-x-1.5";
const itemVerticalClasses = "m-0 relative flex flex-1 gap-x-3";

const textsHorizontalClasses = "flex min-w-0 flex-col gap-x-1 pt-1 items-center";
const textsVerticalClasses = "flex min-w-0 flex-col gap-x-1 pt-1 pb-4";

const bodyHorizontalClasses = "text-base leading-body w-full pt-2 text-start";
const bodyVerticalClasses = "text-base leading-body pt-3";

export function stepsPartClasses(orientation: StepsOrientation = "horizontal"): StepsClassNames {
  const vertical = orientation === "vertical";
  return {
    marker: markerClassesByState,
    rail: railClasses,
    item: vertical ? itemVerticalClasses : itemHorizontalClasses,
    connector: vertical ? connectorVerticalClasses : connectorHorizontalClasses,
    texts: vertical ? textsVerticalClasses : textsHorizontalClasses,
    title: (state: SlotState) => titleClassesByState(vertical, state),
    description: vertical ? descriptionVerticalClasses : descriptionHorizontalClasses,
    body: vertical ? bodyVerticalClasses : bodyHorizontalClasses,
  };
}

export function Steps({
  className,
  classNames,
  orientation,
  ...props
}: StepsProps) {
  return (
    <StepsHeadless
      {...props}
      orientation={orientation}
      className={cn(stepsRootClasses(orientation), className)}
      classNames={mergeStateSlots(stepsPartClasses(orientation), classNames)}
    />
  );
}