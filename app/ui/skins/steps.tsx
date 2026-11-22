import { Steps as StepsHeadless } from "@/ui";
import type { StepsClassNames, StepsProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


export const stepsRootClasses =
  "m-0 list-none p-0 flex w-full items-start data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch";

const markerBaseClasses =
  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-pill " +
  "border-frame border-border text-foreground text-xs leading-4 font-strong disabled:dim [&>svg]:size-3.5";
const markerUpcomingClasses =
  "data-[state=upcoming]:bg-transparent data-[state=upcoming]:text-surface-fg";
const markerActiveClasses =
  "data-[state=completed]:bg-primary data-[state=completed]:text-primary-fg " +
  "data-[state=current]:bg-primary data-[state=current]:text-primary-fg";
const markerFinishedClasses =
  "data-[state=finished]:bg-primary data-[state=finished]:text-primary-fg data-[state=finished]:shadow-checked";
const markerClickableClasses =
  "data-[clickable=true]:cursor-pointer " +
  "data-[clickable=true]:hover:not-disabled:bg-accent data-[clickable=true]:hover:not-disabled:text-accent-fg";
const markerHitClasses =
  "data-[clickable=true]:after:absolute data-[clickable=true]:after:inset-[calc(50%-var(--height-control)/2)] " +
  "data-[clickable=true]:after:content-['']";

const markerClasses = cn(
  markerBaseClasses,
  markerUpcomingClasses,
  markerActiveClasses,
  markerFinishedClasses,
  markerClickableClasses,
  markerHitClasses,
);

const railClasses = "flex shrink-0 flex-col items-center";

// 横竖两套槽位类并存，由 data-orientation 运行期切换（方向只由 prop 决定，皮肤层不持静态方向）
const connectorHorizontalPosClasses =
  "data-[orientation=horizontal]:absolute data-[orientation=horizontal]:top-3";
const connectorHorizontalSpanClasses =
  "data-[orientation=horizontal]:right-[calc(50%+var(--spacing)*3)] data-[orientation=horizontal]:left-[calc(-50%+var(--spacing)*3)]";
const connectorHorizontalLineClasses =
  "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:bg-primary data-[orientation=horizontal]:data-[state=upcoming]:bg-surface";
const connectorVerticalClasses =
  "data-[orientation=vertical]:w-px data-[orientation=vertical]:flex-1 data-[orientation=vertical]:bg-primary " +
  "data-[orientation=vertical]:data-[state=upcoming]:bg-surface";

const connectorClasses = cn(
  connectorHorizontalPosClasses,
  connectorHorizontalSpanClasses,
  connectorHorizontalLineClasses,
  connectorVerticalClasses,
);

const titleBaseClasses =
  "font-label tracking-label case-label data-[state=upcoming]:text-surface-fg data-[clickable=true]:cursor-pointer";
const titleHorizontalClasses =
  "data-[orientation=horizontal]:text-xs data-[orientation=horizontal]:leading-none data-[orientation=horizontal]:text-center";
const titleVerticalClasses =
  "data-[orientation=vertical]:text-start data-[orientation=vertical]:text-sm data-[orientation=vertical]:leading-none";

const titleClasses = cn(titleBaseClasses, titleHorizontalClasses, titleVerticalClasses);

const descriptionBaseClasses = "font-field text-surface-fg";
const descriptionHorizontalClasses =
  "data-[orientation=horizontal]:text-xs data-[orientation=horizontal]:leading-none data-[orientation=horizontal]:text-center";
const descriptionVerticalClasses =
  "data-[orientation=vertical]:text-xs data-[orientation=vertical]:leading-4";

const descriptionClasses = cn(descriptionBaseClasses, descriptionHorizontalClasses, descriptionVerticalClasses);

const partClasses: StepsClassNames = {
  item:
    "m-0 relative flex flex-1 " +
    "data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-x-1.5 " +
    "data-[orientation=vertical]:gap-x-3",
  connector: connectorClasses,
  texts:
    "flex min-w-0 flex-col gap-x-1 pt-1 " +
    "data-[orientation=horizontal]:items-center " +
    "data-[orientation=vertical]:pb-4",
  title: titleClasses,
  description: descriptionClasses,
  body:
    "text-base leading-body " +
    "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:pt-2 data-[orientation=horizontal]:text-start " +
    "data-[orientation=vertical]:pt-3",
};

export function stepsPartClasses(): StepsClassNames {
  return {
    marker: markerClasses,
    rail: railClasses,
    ...partClasses,
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
      className={cn(stepsRootClasses, className)}
      classNames={mergeSlots(stepsPartClasses(), classNames)}
    />
  );
}
