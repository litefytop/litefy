import { Drawer as DrawerHeadless } from "@/ui";
import type { DrawerProps, DrawerPlacement, DrawerSize, DrawerOrientation } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "group/drawer h-dvh w-full max-w-none max-h-none m-0 border-0 bg-transparent p-0 text-inherit outline-none " +
  "overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none]";

const stageSlots: Record<DrawerPlacement, string> = {
  left: "items-stretch justify-items-start",
  right: "items-stretch justify-items-end",
  top: "items-start justify-items-stretch",
  bottom: "items-end justify-items-stretch",
};

const panelDurationClasses =
  "data-[static]:duration-md data-[static]:ease-frame " +
  "group-data-[duration=sm]:data-[static]:duration-sm! group-data-[duration=lg]:data-[static]:duration-lg!";

const panelPlacementSlots: Record<DrawerPlacement, string> = {
  left: "h-full flex-row-reverse",
  right: "h-full flex-row",
  top: "w-full flex-col-reverse",
  bottom: "w-full flex-col",
};

const widthSlots: Record<DrawerSize, string> = {
  sm: "w-full max-w-[20rem]",
  md: "w-full max-w-[24rem]",
  lg: "w-full max-w-[32rem]",
};
const heightSlots: Record<DrawerSize, string> = {
  sm: "h-full max-h-[20rem]",
  md: "h-full max-h-[24rem]",
  lg: "h-full max-h-[32rem]",
};

const dragSlots: Record<DrawerOrientation, string> = {
  horizontal: "h-full w-4 border-x-frame border-x-border before:h-12 before:w-1",
  vertical: "h-4 w-full border-y-frame border-y-border before:h-1 before:w-12",
};

export function Drawer({ classNames, className, placement = "right", size = "md", ...props }: DrawerProps) {
  const orientation: DrawerOrientation =
    placement === "left" || placement === "right" ? "horizontal" : "vertical";
  const stageClasses = cn("grid h-[calc(100dvh+1px)] w-full", stageSlots[placement]);
  const panelClasses = cn(
    "@container flex min-w-0 min-h-0 overflow-hidden rounded-xl",
    "border-frame border-border bg-surface-raised text-surface-raised-fg shadow-elevated",
    panelDurationClasses,
    panelPlacementSlots[placement],
    orientation === "horizontal" ? widthSlots[size] : heightSlots[size],
  );
  const dragClasses = cn(
    "flex shrink-0 items-center justify-center before:content-[''] before:rounded-sm",
    dragSlots[orientation],
  );
  const contentClasses = cn(
    "flex min-h-0 min-w-0 flex-1 flex-col overflow-auto text-base leading-body",
    orientation === "vertical" && "items-center",
  );
  return (
    <DrawerHeadless
      {...props}
      placement={placement}
      size={size}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ stage: stageClasses, wrapper: panelClasses, drag: dragClasses, content: contentClasses }, classNames)}
    />
  );
}