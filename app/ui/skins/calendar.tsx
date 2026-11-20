import { Calendar as CalendarHeadless } from "@/ui";
import type { CalendarProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";


const rootClasses =
  "flex w-full max-w-[calc(7*var(--width-control)+6*var(--spacing))] flex-col rounded-lg border-frame border-border p-3 text-foreground shadow-surface";


const rootInPanelClasses = "flex flex-col";

const headerClasses = "flex items-center justify-between gap-x-2";


const navClasses =
  cn(buttonVariants.text, "size-control px-0 md:px-0");

const navIconClasses = "size-4 flex-none";

const titleClasses =
  cn(buttonVariants.text, "px-2 text-sm font-strong");

const titleRowClasses = "flex flex-1 items-center justify-center gap-x-2";


const gridClasses = "grid grid-cols-1";

const weekClasses = "grid grid-cols-7 data-[cols=3]:grid-cols-3";

const weekdayClasses =
  "flex h-8 items-center justify-center text-xs font-label tracking-label case-label text-surface-fg";

const dayBaseClasses =
  "inline-flex h-control w-full cursor-pointer items-center justify-center rounded-md bg-transparent " +
  "text-foreground hover:bg-accent hover:text-accent-fg text-sm font-field tabular-nums select-none " +
  "focus-visible:focus-ring-inset " +
  "disabled:cursor-not-allowed disabled:text-surface-fg " +
  "data-[outside-month=true]:text-foreground/50";

const dayClasses =
  cn(
    dayBaseClasses,
    "aria-selected:bg-primary aria-selected:text-primary-fg aria-selected:hover:bg-primary aria-selected:hover:text-primary-fg",
  );


export const calendarRootClasses = rootClasses;

export const calendarDayBaseClasses = dayBaseClasses;


export const calendarInPanelClasses = rootInPanelClasses;

/* A top-layer popover has its own sizing: it must never be squeezed down to the
   width of a narrow trigger (e.g. a date filter inside a table header cell).
   Seven square day cells plus the panel padding define the natural calendar
   width; the viewport cap only kicks in on very small screens, and scrolling
   is preferred over compressing the grid. */
export const calendarPopoverWidthClasses =
  "w-[calc(7*var(--width-control)+6*var(--spacing))] max-w-[calc(100vw-1rem)] overflow-x-auto";

export const calendarPanelWidthClasses =
  "w-max min-w-[calc(7*var(--width-control))]";

export const calendarClasses = {
  header: headerClasses,
  nav: navClasses,
  navIcon: navIconClasses,
  title: titleClasses,
  titleRow: titleRowClasses,
  grid: gridClasses,
  week: weekClasses,
  weekday: weekdayClasses,
  day: dayClasses,
};

export const calendarPartClasses = calendarClasses;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <CalendarHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(calendarClasses, classNames)}
    />
  );
}
