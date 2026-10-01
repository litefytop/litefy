"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import {
    addDays,
    addMonths,
    addYears,
    dateFromParts,
    daysInMonth,
    isSameDate,
    startOfMonth,
    toISODate,
} from "../utils/date-math";
export interface CalendarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: ClassNameValue;
}
export function CalendarRoot({ className, ...props }: CalendarRootProps) {
    return (<div {...props} className={cn("inline-flex flex-col gap-2 rounded-lg border border-border bg-background text-foreground p-3", className)}/>);
}
export interface CalendarHeaderProps extends Omit<React.ComponentProps<"header">, "className"> {
    className?: ClassNameValue;
}
export function CalendarHeader({ className, ...props }: CalendarHeaderProps) {
    return <header {...props} className={cn("flex items-center justify-between gap-2", className)}/>;
}
export interface CalendarNavButtonProps extends Omit<React.ComponentProps<"button">, "className" | "type" | "aria-label"> {
    direction: "previous" | "next";
    label?: string;
    className?: ClassNameValue;
}
export function CalendarNavButton({ direction, label, className, children, ...props }: CalendarNavButtonProps) {
    const Chevron = direction === "previous" ? ChevronLeft : ChevronRight;
    return (<button type="button" aria-label={label ?? (direction === "previous" ? "Previous" : "Next")} {...props} className={cn("inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground cursor-pointer transition-colors hover:bg-muted hover:text-foreground", className)}>
      {children ?? <Chevron className="size-4"/>}
    </button>);
}
export interface CalendarTitleButtonProps extends Omit<React.ComponentProps<"button">, "className" | "type"> {
    className?: ClassNameValue;
}
export function CalendarTitleButton({ className, ...props }: CalendarTitleButtonProps) {
    return (<button type="button" {...props} className={cn("inline-flex h-8 items-center justify-center rounded-md px-2 text-sm font-medium cursor-pointer transition-colors hover:bg-muted", "data-active:bg-muted", className)}/>);
}
export const calendarMonthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
type CalendarGridUnit = "days" | "months" | "years";
function gridArrowOffset(key: string, columns: number): number {
    if (key === "ArrowRight")
        return 1;
    if (key === "ArrowLeft")
        return -1;
    if (key === "ArrowDown")
        return columns;
    if (key === "ArrowUp")
        return -columns;
    return 0;
}
function moveGridFocus(grid: Element, anchor: Date, offset: number, unit: CalendarGridUnit, attribute: string, toKey: (date: Date) => string, maxSteps: number, onNavigate?: (date: Date) => void) {
    let next = anchor;
    for (let i = 0; i < maxSteps; i++) {
        next =
            unit === "days"
                ? addDays(next, offset)
                : unit === "months"
                    ? addMonths(next, offset)
                    : addYears(next, offset);
        const button = grid.querySelector<HTMLButtonElement>(`button[${attribute}="${toKey(next)}"]`);
        if (!button) {
            onNavigate?.(next);
            return;
        }
        if (!button.disabled) {
            button.focus();
            return;
        }
    }
}
export interface CalendarGridProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    weeks: Date[][];
    visibleMonth: Date;
    value?: Date | null;
    isDateDisabled?: (date: Date) => boolean;
    onSelect?: (date: Date) => void;
    onNavigate?: (date: Date) => void;
    firstDayOfWeek?: 0 | 1;
    className?: ClassNameValue;
}
export function CalendarGrid({ weeks, visibleMonth, value, isDateDisabled, onSelect, onNavigate, firstDayOfWeek = 0, className, ...props }: CalendarGridProps) {
    const weekdayLabels = firstDayOfWeek === 1
        ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const inMonth = value && value.getFullYear() === visibleMonth.getFullYear() && value.getMonth() === visibleMonth.getMonth()
        ? value
        : startOfMonth(visibleMonth);
    const tabStopDate = toISODate(inMonth);
    return (<div role="grid" {...props} className={cn("grid grid-cols-7 gap-y-1", className)}>
      <div role="row" className="col-span-7 grid grid-cols-7">
        {weekdayLabels.map((label) => (<div key={label} role="columnheader" className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">
            {label}
          </div>))}
      </div>
      {weeks.map((week, index) => (<CalendarGridRow key={index} week={week} visibleMonth={visibleMonth} value={value} isDateDisabled={isDateDisabled} onSelect={onSelect} onNavigate={onNavigate} tabStopDate={tabStopDate} className="col-span-7"/>))}
    </div>);
}
export interface CalendarGridRowProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    week: Date[];
    visibleMonth: Date;
    value?: Date | null;
    isDateDisabled?: (date: Date) => boolean;
    onSelect?: (date: Date) => void;
    onNavigate?: (date: Date) => void;
    tabStopDate?: string;
    className?: ClassNameValue;
}
export function CalendarGridRow({ week, visibleMonth, value, isDateDisabled, onSelect, onNavigate, tabStopDate, className, ...props }: CalendarGridRowProps) {
    return (<div role="row" {...props} className={cn("grid grid-cols-7", className)}>
      {week.map((date) => (<CalendarGridCell key={toISODate(date)} date={date} outsideMonth={date.getFullYear() !== visibleMonth.getFullYear() || date.getMonth() !== visibleMonth.getMonth()} selected={value ? isSameDate(value, date) : false} disabled={isDateDisabled?.(date) ?? false} tabStop={tabStopDate === undefined ? undefined : toISODate(date) === tabStopDate} onClick={onSelect ? () => onSelect(date) : undefined} onNavigate={onNavigate}/>))}
    </div>);
}
export interface CalendarGridCellProps extends Omit<React.ComponentProps<"button">, "className" | "type"> {
    date: Date;
    outsideMonth?: boolean;
    selected?: boolean;
    tabStop?: boolean;
    onNavigate?: (date: Date) => void;
    className?: ClassNameValue;
}
export function CalendarGridCell({ date, outsideMonth, selected, tabStop, onNavigate, className, onKeyDown: onKeyDownProp, ...props }: CalendarGridCellProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDownProp?.(e);
        if (e.defaultPrevented)
            return;
        const offset = gridArrowOffset(e.key, 7);
        if (!offset)
            return;
        e.preventDefault();
        const grid = e.currentTarget.closest('[role="grid"]');
        if (!grid)
            return;
        moveGridFocus(grid, date, offset, "days", "data-date", toISODate, 31, onNavigate);
    };
    return (<button type="button" role="gridcell" aria-selected={selected} data-outside-month={outsideMonth || undefined} data-date={toISODate(date)} tabIndex={tabStop === undefined ? undefined : tabStop ? 0 : -1} {...props} onKeyDown={handleKeyDown} className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-sm tabular-nums cursor-pointer select-none", "transition-colors hover:bg-muted", "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary", "data-outside-month:opacity-40", className)}>
      {date.getDate()}
    </button>);
}
export interface CalendarMonthGridProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    visibleMonth: Date;
    value?: Date | null;
    isMonthDisabled?: (month: Date) => boolean;
    onSelect?: (month: Date) => void;
    onNavigate?: (month: Date) => void;
    className?: ClassNameValue;
}
export function CalendarMonthGrid({ visibleMonth, value, isMonthDisabled, onSelect, onNavigate, className, ...props }: CalendarMonthGridProps) {
    const months = Array.from({ length: 12 }, (_, index) => dateFromParts(visibleMonth.getFullYear(), index, 1));
    const rows = Array.from({ length: 4 }, (_, index) => months.slice(index * 3, index * 3 + 3));
    const tabStopDate = value && value.getFullYear() === visibleMonth.getFullYear()
        ? toISODate(startOfMonth(value))
        : toISODate(startOfMonth(visibleMonth));
    const handleKeyDown = (month: Date) => {
        return (e: React.KeyboardEvent<HTMLButtonElement>) => {
            const offset = gridArrowOffset(e.key, 3);
            if (!offset)
                return;
            e.preventDefault();
            const grid = e.currentTarget.closest('[role="grid"]');
            if (!grid)
                return;
            moveGridFocus(grid, month, offset, "months", "data-month", toISODate, 24, onNavigate);
        };
    };
    return (<div role="grid" {...props} className={cn("grid grid-cols-3 gap-y-1", className)}>
      {rows.map((row, index) => (<div role="row" key={index} className="col-span-3 grid grid-cols-3 gap-x-1">
          {row.map((month) => (<button key={toISODate(month)} type="button" role="gridcell" aria-selected={value?.getFullYear() === month.getFullYear() && value?.getMonth() === month.getMonth()} data-month={toISODate(month)} tabIndex={toISODate(month) === tabStopDate ? 0 : -1} disabled={isMonthDisabled?.(month)} onClick={onSelect ? () => onSelect(month) : undefined} onKeyDown={handleKeyDown(month)} className={cn("inline-flex h-8 items-center justify-center rounded-md text-sm tabular-nums cursor-pointer select-none", "transition-colors hover:bg-muted", "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary")}>
              {Calendar.calendarMonthLabels[month.getMonth()]}
            </button>))}
        </div>))}
    </div>);
}
export interface CalendarYearGridProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    visibleMonth: Date;
    value?: Date | null;
    isYearDisabled?: (year: Date) => boolean;
    onSelect?: (year: Date) => void;
    onNavigate?: (year: Date) => void;
    className?: ClassNameValue;
}
export function CalendarYearGrid({ visibleMonth, value, isYearDisabled, onSelect, onNavigate, className, ...props }: CalendarYearGridProps) {
    const startYear = visibleMonth.getFullYear() - 5;
    const years = Array.from({ length: 12 }, (_, index) => dateFromParts(startYear + index, 0, 1));
    const rows = Array.from({ length: 4 }, (_, index) => years.slice(index * 3, index * 3 + 3));
    const tabStopYear = value && years.some((year) => year.getFullYear() === value.getFullYear()) ? value.getFullYear() : visibleMonth.getFullYear();
    const handleKeyDown = (year: Date) => {
        return (e: React.KeyboardEvent<HTMLButtonElement>) => {
            const offset = gridArrowOffset(e.key, 3);
            if (!offset)
                return;
            e.preventDefault();
            const grid = e.currentTarget.closest('[role="grid"]');
            if (!grid)
                return;
            moveGridFocus(grid, year, offset, "years", "data-year", (d) => String(d.getFullYear()), 24, onNavigate);
        };
    };
    return (<div role="grid" {...props} className={cn("grid grid-cols-3 gap-y-1", className)}>
      {rows.map((row, index) => (<div role="row" key={index} className="col-span-3 grid grid-cols-3 gap-x-1">
          {row.map((year) => (<button key={year.getFullYear()} type="button" role="gridcell" aria-selected={value?.getFullYear() === year.getFullYear()} data-year={year.getFullYear()} tabIndex={year.getFullYear() === tabStopYear ? 0 : -1} disabled={isYearDisabled?.(year)} onClick={onSelect ? () => onSelect(year) : undefined} onKeyDown={handleKeyDown(year)} className={cn("inline-flex h-8 items-center justify-center rounded-md text-sm tabular-nums cursor-pointer select-none", "transition-colors hover:bg-muted", "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary")}>
              {year.getFullYear()}
            </button>))}
        </div>))}
    </div>);
}
export type CalendarView = "days" | "months" | "years";
export interface CalendarProps extends Omit<React.ComponentProps<"div">, "className" | "defaultValue" | "onChange"> {
    value?: Date | null;
    defaultValue?: Date | null;
    visibleMonth: Date;
    view?: CalendarView;
    defaultView?: CalendarView;
    onChange?: (date: Date) => void;
    onVisibleMonthChange?: (month: Date) => void;
    onViewChange?: (view: CalendarView) => void;
    onMonthSelect?: (month: Date) => void;
    onYearSelect?: (year: Date) => void;
    isDateDisabled?: (date: Date) => boolean;
    firstDayOfWeek?: 0 | 1;
    className?: ClassNameValue;
}
export function Calendar({ value: controlledValue, defaultValue, visibleMonth, view: controlledView, defaultView, onChange, onVisibleMonthChange, onViewChange, onMonthSelect, onYearSelect, isDateDisabled, firstDayOfWeek = 0, className, ...props }: CalendarProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const pendingFocusRef = React.useRef<{
        attribute: string;
        value: string;
    } | null>(null);
    const [uncontrolledValue, setValue] = React.useState<Date | null>(defaultValue ?? null);
    const [uncontrolledView, setView] = React.useState<CalendarView>(defaultView ?? "days");
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const isViewControlled = controlledView !== undefined;
    const view = isViewControlled ? controlledView : uncontrolledView;
    const firstOfMonth = startOfMonth(visibleMonth);
    const offset = firstDayOfWeek === 1 ? (firstOfMonth.getDay() + 6) % 7 : firstOfMonth.getDay();
    const start = addDays(firstOfMonth, -offset);
    const weekCount = Math.ceil((offset + daysInMonth(visibleMonth.getFullYear(), visibleMonth.getMonth())) / 7);
    const weeks = Array.from({ length: weekCount }, (_, weekIndex) => Array.from({ length: 7 }, (_, dayIndex) => addDays(start, weekIndex * 7 + dayIndex)));
    const handleViewChange = (next: CalendarView) => {
        if (!isViewControlled)
            setView(next);
        onViewChange?.(next);
    };
    const handleSelect = (date: Date) => {
        if (date.getFullYear() !== visibleMonth.getFullYear() || date.getMonth() !== visibleMonth.getMonth())
            return;
        if (!isControlled)
            setValue(date);
        onChange?.(date);
    };
    const handleNavigate = (date: Date) => {
        pendingFocusRef.current = { attribute: "data-date", value: toISODate(date) };
        onVisibleMonthChange?.(startOfMonth(date));
    };
    const handleMonthSelect = (month: Date) => {
        const inMonth = value && value.getFullYear() === month.getFullYear() && value.getMonth() === month.getMonth() ? value : month;
        pendingFocusRef.current = { attribute: "data-date", value: toISODate(inMonth) };
        onMonthSelect?.(month);
        onVisibleMonthChange?.(month);
        handleViewChange("days");
    };
    const handleMonthNavigate = (month: Date) => {
        pendingFocusRef.current = { attribute: "data-month", value: toISODate(month) };
        onVisibleMonthChange?.(month);
    };
    const handleYearSelect = (year: Date) => {
        const next = dateFromParts(year.getFullYear(), visibleMonth.getMonth(), 1);
        pendingFocusRef.current = { attribute: "data-month", value: toISODate(next) };
        onYearSelect?.(year);
        onVisibleMonthChange?.(next);
        handleViewChange("months");
    };
    const handleYearNavigate = (year: Date) => {
        pendingFocusRef.current = { attribute: "data-year", value: String(year.getFullYear()) };
        onVisibleMonthChange?.(dateFromParts(year.getFullYear(), visibleMonth.getMonth(), 1));
    };
    React.useEffect(() => {
        const target = pendingFocusRef.current;
        if (!target)
            return;
        pendingFocusRef.current = null;
        rootRef.current
            ?.querySelector<HTMLButtonElement>(`button[${target.attribute}="${target.value}"]`)
            ?.focus();
    });
    const handlePrevious = () => {
        if (view === "days")
            onVisibleMonthChange?.(addMonths(visibleMonth, -1));
        else if (view === "months")
            onVisibleMonthChange?.(addYears(visibleMonth, -1));
        else
            onVisibleMonthChange?.(addYears(visibleMonth, -12));
    };
    const handleNext = () => {
        if (view === "days")
            onVisibleMonthChange?.(addMonths(visibleMonth, 1));
        else if (view === "months")
            onVisibleMonthChange?.(addYears(visibleMonth, 1));
        else
            onVisibleMonthChange?.(addYears(visibleMonth, 12));
    };
    const navUnit = view === "days" ? "month" : view === "months" ? "year" : "years";
    const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.defaultPrevented || e.key !== "ArrowDown")
            return;
        const grid = rootRef.current?.querySelector<HTMLElement>('[role="grid"]');
        if (!grid)
            return;
        e.preventDefault();
        const tabStop = grid.querySelector<HTMLElement>('button[tabindex="0"]');
        (tabStop ?? grid).focus();
    };
    return (<CalendarRoot ref={rootRef} {...props} className={className}>
      <CalendarHeader onKeyDown={handleHeaderKeyDown}>
        <CalendarNavButton direction="previous" label={`Previous ${navUnit}`} onClick={handlePrevious}/>
        <div className="flex flex-1 items-center justify-center gap-1">
          <CalendarTitleButton data-active={view === "years" || undefined} onClick={() => handleViewChange("years")}>
            {visibleMonth.getFullYear()}
          </CalendarTitleButton>
          <CalendarTitleButton data-active={view === "months" || undefined} onClick={() => handleViewChange("months")}>
            {Calendar.calendarMonthLabels[visibleMonth.getMonth()]}
          </CalendarTitleButton>
        </div>
        <CalendarNavButton direction="next" label={`Next ${navUnit}`} onClick={handleNext}/>
      </CalendarHeader>
      {view === "days" && (<CalendarGrid weeks={weeks} visibleMonth={visibleMonth} value={value} isDateDisabled={isDateDisabled} onSelect={handleSelect} onNavigate={handleNavigate} firstDayOfWeek={firstDayOfWeek}/>)}
      {view === "months" && (<CalendarMonthGrid visibleMonth={visibleMonth} value={value} onSelect={handleMonthSelect} onNavigate={handleMonthNavigate}/>)}
      {view === "years" && (<CalendarYearGrid visibleMonth={visibleMonth} value={value} onSelect={handleYearSelect} onNavigate={handleYearNavigate}/>)}
    </CalendarRoot>);
}
Calendar.calendarMonthLabels = calendarMonthLabels;
