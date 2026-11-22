import { Drawer as DrawerHeadless } from "@/ui";
import type { DrawerProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "group/drawer h-dvh w-full max-w-none max-h-none m-0 border-0 bg-transparent p-0 text-inherit outline-none " +
  "overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none]";

const stageBaseClasses = "pointer-events-none grid h-[calc(100dvh+1px)] w-full";

const stageLeftClasses =
  "data-[placement=left]:items-stretch data-[placement=left]:justify-items-start";
const stageRightClasses =
  "data-[placement=right]:items-stretch data-[placement=right]:justify-items-end";
const stageTopClasses =
  "data-[placement=top]:items-start data-[placement=top]:justify-items-stretch";
const stageBottomClasses =
  "data-[placement=bottom]:items-end data-[placement=bottom]:justify-items-stretch";

const stageClasses = cn(stageBaseClasses, stageLeftClasses, stageRightClasses, stageTopClasses, stageBottomClasses);

const panelBaseClasses =
  "pointer-events-auto group-focus-visible/drawer:focus-ring @container flex overflow-hidden rounded-xl";
const panelFaceClasses =
  "border-frame border-border bg-surface-raised text-foreground shadow-elevated";
const panelSizeClasses =
  "[--litefy-pane-size:--spacing(96)] data-[size=sm]:[--litefy-pane-size:--spacing(80)] data-[size=lg]:[--litefy-pane-size:--spacing(128)]";
const panelDurationClasses =
  "data-[static]:duration-md data-[static]:ease-frame";
const panelDurationOverrideClasses =
  "group-data-[duration=sm]:data-[static]:duration-sm! group-data-[duration=lg]:data-[static]:duration-lg!";
const panelLeftClasses =
  "data-[placement=left]:h-full data-[placement=left]:w-(--litefy-pane-size) data-[placement=left]:max-w-full " +
  "data-[placement=left]:min-w-[min(100%,--spacing(64))] data-[placement=left]:flex-row-reverse";
const panelRightClasses =
  "data-[placement=right]:h-full data-[placement=right]:w-(--litefy-pane-size) data-[placement=right]:max-w-full " +
  "data-[placement=right]:min-w-[min(100%,--spacing(64))] data-[placement=right]:flex-row";
const panelTopClasses =
  "data-[placement=top]:w-full data-[placement=top]:h-(--litefy-pane-size) " +
  "data-[placement=top]:min-h-[min(100%,--spacing(48))] data-[placement=top]:flex-col-reverse";
const panelBottomClasses =
  "data-[placement=bottom]:w-full data-[placement=bottom]:h-(--litefy-pane-size) " +
  "data-[placement=bottom]:min-h-[min(100%,--spacing(48))] data-[placement=bottom]:flex-col";

const panelClasses = cn(
  panelBaseClasses,
  panelFaceClasses,
  panelSizeClasses,
  panelDurationClasses,
  panelDurationOverrideClasses,
  panelLeftClasses,
  panelRightClasses,
  panelTopClasses,
  panelBottomClasses,
);

const dragBaseClasses = "flex shrink-0 items-center justify-center before:content-[''] before:rounded-sm";
const dragHorizontalBoxClasses =
  "data-[orientation=horizontal]:h-full data-[orientation=horizontal]:w-4 " +
  "data-[orientation=horizontal]:border-x-frame data-[orientation=horizontal]:border-x-border";
const dragHorizontalHandleClasses =
  "data-[orientation=horizontal]:before:h-12 data-[orientation=horizontal]:before:w-1";
const dragVerticalBoxClasses =
  "data-[orientation=vertical]:h-4 data-[orientation=vertical]:w-full " +
  "data-[orientation=vertical]:border-y-frame data-[orientation=vertical]:border-y-border";
const dragVerticalHandleClasses =
  "data-[orientation=vertical]:before:h-1 data-[orientation=vertical]:before:w-12";

const dragClasses = cn(
  dragBaseClasses,
  dragHorizontalBoxClasses,
  dragHorizontalHandleClasses,
  dragVerticalBoxClasses,
  dragVerticalHandleClasses,
);

const contentClasses =
  "flex min-h-0 min-w-0 flex-1 flex-col overflow-auto text-base leading-body data-[orientation=vertical]:items-center";

export function Drawer({ classNames, className, ...props }: DrawerProps) {
  return (
    <DrawerHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ stage: stageClasses, wrapper: panelClasses, drag: dragClasses, content: contentClasses }, classNames)}
    />
  );
}
