import { Calendar as CalendarHeadless } from "@/ui";
import type { CalendarProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";
import { buttonVariants } from "./button";


const rootClasses =
  "flex w-full min-w-0 max-w-[calc(7*var(--width-control)+6*var(--spacing))] flex-col rounded-lg border-frame p-3 text-foreground shadow-surface";


const rootInPanelClasses = "flex flex-col";

const headerClasses = "flex items-center justify-between gap-x-2";


const navClasses = cn(buttonVariants.text, "pure-icon", "size-control");
const navDisabledClasses = cn(buttonVariants.disabledText, "pure-icon", "size-control");

const navIconClasses = "size-4 flex-none";

const titleClasses = cn(buttonVariants.text, "text-sm font-strong");
const titleDisabledClasses = cn(buttonVariants.disabledText, "text-sm font-strong");

const titleRowClasses = "flex flex-1 items-center justify-center gap-x-2";


const gridClasses = "grid grid-cols-1";

const weekClasses = "grid grid-cols-7 data-[cols=3]:grid-cols-3";

const weekdayClasses = ({ disabled }: SlotState) =>
  "flex h-8 items-center justify-center text-xs control-label " +
  (disabled ? "text-disabled-fg" : "text-foreground");

const dayBaseClasses =
  "flex h-control cursor-pointer items-center justify-center rounded-none text-sm font-field tabular-nums select-none focus-visible:focus-ring-inset";

const dayDisabledClasses =
  "flex h-control cursor-not-allowed items-center justify-center rounded-none bg-disabled text-sm font-field tabular-nums select-none text-disabled-fg";


export const calendarRootClasses = rootClasses;

export const calendarDayBaseClasses = dayBaseClasses;


export const calendarInPanelClasses = rootInPanelClasses;

/* A top-layer popover has its own sizing: it must never be squeezed down to the
   width of a narrow trigger (e.g. a date filter inside a table header cell).
   Seven square day cells plus the panel padding define the natural calendar
   width; the viewport cap only kicks in on very small screens, and scrolling
   is preferred over compressing the grid. */
export const calendarPopoverWidthClasses =
  "w-[calc(7*var(--width-control)+6*var(--spacing))] max-w-[min(20rem,calc(100vw_-_1rem))] overflow-x-auto";

export const calendarPanelWidthClasses =
  "w-max min-w-[calc(7*var(--width-control))]";

export const calendarClasses = {
  header: headerClasses,
  nav: ({ disabled }: SlotState) => disabled ? navDisabledClasses : navClasses,
  navIcon: navIconClasses,
  title: ({ disabled }: SlotState) => disabled ? titleDisabledClasses : titleClasses,
  titleRow: titleRowClasses,
  grid: gridClasses,
  week: weekClasses,
  weekday: weekdayClasses,
  day: ({ disabled, active, outsideMonth }: SlotState) =>
    disabled
      ? dayDisabledClasses
      : active
        ? cn(dayBaseClasses, "bg-primary text-primary-fg")
        : outsideMonth
          ? cn(dayBaseClasses, "bg-surface text-surface-fg")
          : cn(dayBaseClasses, "hover:bg-accent hover:text-accent-fg"),
};

export const calendarPartClasses = calendarClasses;

const rootDisabledClasses =
  "flex w-full min-w-0 max-w-[calc(7*var(--width-control)+6*var(--spacing))] flex-col rounded-lg border-frame bg-disabled p-3 text-disabled-fg shadow-surface";

const rootClassesByState = (disabled: boolean | undefined) =>
  disabled ? rootDisabledClasses : rootClasses;

export function Calendar({ className, classNames, disabled, ...props }: CalendarProps) {
  return (
    <CalendarHeadless
      {...props}
      disabled={disabled}
      className={cn(rootClassesByState(disabled), className)}
      classNames={mergeStateSlots(calendarClasses, classNames)}
    />
  );
}
