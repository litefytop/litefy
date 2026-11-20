"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "./icons";
import {
    addDays,
    addMonths,
    addYears,
    compareDates,
    dateFromParts,
    daysInMonth,
    isSameDate,
    startOfMonth,
    toISODate,
} from "../utils/date-math";
export interface CalendarRange {
    start: Date | null;
    end: Date | null;
}
export interface CalendarClassNames {
    header?: string;
    nav?: string;
    navIcon?: string;
    title?: string;
    titleRow?: string;
    grid?: string;
    week?: string;
    weekday?: string;
    day?: string;
}
export interface CalendarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function CalendarRoot(props: CalendarRootProps) {
    return (<div {...props}/>);
}
export interface CalendarHeaderProps extends Omit<React.ComponentProps<"header">, "className"> {
    className?: string;
}
export function CalendarHeader(props: CalendarHeaderProps) {
    return <header {...props}/>;
}
export interface CalendarNavButtonProps extends Omit<React.ComponentProps<"button">, "className" | "type"> {
    direction: "previous" | "next";
    className?: string;
    classNames?: {
        icon?: string;
    };
}
export function CalendarNavButton({ direction, className, classNames, children, ...props }: CalendarNavButtonProps) {
    const Chevron = direction === "previous" ? ChevronLeft : ChevronRight;
    return (<button type="button" aria-label={direction === "previous" ? "Previous" : "Next"} {...props} className={className}>
      {children ?? <Chevron aria-hidden className={classNames?.icon}/>}
    </button>);
}
export interface CalendarTitleButtonProps extends Omit<React.ComponentProps<"button">, "className" | "type"> {
    className?: string;
}
export function CalendarTitleButton(props: CalendarTitleButtonProps) {
    return (<button type="button" {...props}/>);
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
export function moveGridFocus(grid: Element, anchor: Date, offset: number, unit: CalendarGridUnit, attribute: string, toKey: (date: Date) => string, maxSteps: number, onNavigate?: (date: Date) => void) {
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
            if (unit === "days" && button.dataset.outsideMonth === "true") {
                onNavigate?.(next);
                return;
            }
            button.focus();
            return;
        }
    }
    onNavigate?.(next);
}
export interface CalendarGridProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    weeks: Date[][];
    visibleMonth: Date;
    value?: Date | null;
    range?: CalendarRange;
    weekdayLabels?: string[];
    isDateDisabled?: (date: Date) => boolean;
    onSelect?: (date: Date) => void;
    onNavigate?: (date: Date) => void;
    onHoverDateChange?: (date: Date | null) => void;
    firstDayOfWeek?: 0 | 1;
    className?: string;
    classNames?: Pick<CalendarClassNames, "grid" | "week" | "weekday" | "day">;
}
export function CalendarGrid({ weeks, visibleMonth, value, range, weekdayLabels, isDateDisabled, onSelect, onNavigate, onHoverDateChange, firstDayOfWeek = 0, className, classNames, ...props }: CalendarGridProps) {
    const defaults = firstDayOfWeek === 1
        ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const labels = weekdayLabels?.length === 7 ? weekdayLabels : defaults;
    const inMonth = value && value.getFullYear() === visibleMonth.getFullYear() && value.getMonth() === visibleMonth.getMonth()
        ? value
        : startOfMonth(visibleMonth);
    let tabStopDate = toISODate(inMonth);
    if (isDateDisabled?.(inMonth)) {
        const total = daysInMonth(visibleMonth.getFullYear(), visibleMonth.getMonth());
        for (let d = inMonth.getDate() + 1; d <= total; d++) {
            const candidate = dateFromParts(visibleMonth.getFullYear(), visibleMonth.getMonth(), d);
            if (!isDateDisabled(candidate)) {
                tabStopDate = toISODate(candidate);
                break;
            }
        }
    }
    return (<div role="grid" {...props} onMouseLeave={onHoverDateChange ? () => onHoverDateChange(null) : undefined} className={[classNames?.grid, className].filter(Boolean).join(" ")}>
      <div role="row" data-heading="true" className={classNames?.week}>
        {labels.map((label) => (<div key={label} role="columnheader" className={classNames?.weekday}>
            {label}
          </div>))}
      </div>
      {weeks.map((week) => (<CalendarGridRow key={toISODate(week[0])} week={week} visibleMonth={visibleMonth} value={value} range={range} isDateDisabled={isDateDisabled} onSelect={onSelect} onNavigate={onNavigate} onHoverDateChange={onHoverDateChange} tabStopDate={tabStopDate} classNames={{ week: classNames?.week, day: classNames?.day }} data-heading="false"/>))}
    </div>);
}
function rangeRoleFor(date: Date, range?: CalendarRange): "start" | "end" | "between" | "single" | undefined {
    if (!range?.start) return undefined;
    if (!range.end) return isSameDate(date, range.start) ? "single" : undefined;
    const order = compareDates(range.start, range.end);
    const low = order <= 0 ? range.start : range.end;
    const high = order <= 0 ? range.end : range.start;
    if (compareDates(date, low) < 0 || compareDates(date, high) > 0) return undefined;
    if (order === 0) return "single";
    if (compareDates(date, low) === 0) return "start";
    if (compareDates(date, high) === 0) return "end";
    return "between";
}
export interface CalendarGridRowProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    week: Date[];
    visibleMonth: Date;
    value?: Date | null;
    range?: CalendarRange;
    isDateDisabled?: (date: Date) => boolean;
    onSelect?: (date: Date) => void;
    onNavigate?: (date: Date) => void;
    onHoverDateChange?: (date: Date | null) => void;
    tabStopDate?: string;
    className?: string;
    classNames?: Pick<CalendarClassNames, "week" | "day">;
}
export function CalendarGridRow({ week, visibleMonth, value, range, isDateDisabled, onSelect, onNavigate, onHoverDateChange, tabStopDate, className, classNames, ...props }: CalendarGridRowProps) {
    return (<div role="row" {...props} className={[classNames?.week, className].filter(Boolean).join(" ")}>
      {week.map((date) => (<CalendarGridCell key={toISODate(date)} date={date} outsideMonth={date.getFullYear() !== visibleMonth.getFullYear() || date.getMonth() !== visibleMonth.getMonth()} selected={value ? isSameDate(value, date) : false} rangeRole={rangeRoleFor(date, range)} disabled={isDateDisabled?.(date) ?? false} tabStop={tabStopDate === undefined ? undefined : toISODate(date) === tabStopDate} onSelect={onSelect} onHover={onHoverDateChange ?? undefined} onNavigate={onNavigate} className={classNames?.day}/>))}
    </div>);
}
export interface CalendarGridCellProps extends Omit<React.ComponentProps<"button">, "className" | "type" | "onSelect"> {
    date: Date;
    outsideMonth?: boolean;
    selected?: boolean;
    rangeRole?: "start" | "end" | "between" | "single";
    tabStop?: boolean;
    onNavigate?: (date: Date) => void;
    onSelect?: (date: Date) => void;
    onHover?: (date: Date) => void;
    className?: string;
}
export const CalendarGridCell = React.memo(function CalendarGridCell({ date, outsideMonth, selected, rangeRole, tabStop, onNavigate, onSelect, onHover, className, onKeyDown: onKeyDownProp, onClick: onClickProp, ...props }: CalendarGridCellProps) {
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
    return (<button type="button" role="gridcell" aria-selected={selected || rangeRole !== undefined} data-outside-month={outsideMonth || undefined} data-date={toISODate(date)} data-range={rangeRole} data-in-range={rangeRole !== undefined || undefined} tabIndex={tabStop === undefined ? undefined : tabStop ? 0 : -1} {...props} onClick={(e) => {
        onClickProp?.(e);
        onSelect?.(date);
    }} onMouseEnter={onHover ? () => onHover(date) : undefined} onKeyDown={handleKeyDown} className={className}>
      {date.getDate()}
    </button>);
});
export interface CalendarMonthGridProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    visibleMonth: Date;
    value?: Date | null;
    isMonthDisabled?: (month: Date) => boolean;
    onSelect?: (month: Date) => void;
    onNavigate?: (month: Date) => void;
    className?: string;
    classNames?: Pick<CalendarClassNames, "grid" | "week" | "day">;
}
export function CalendarMonthGrid({ visibleMonth, value, isMonthDisabled, onSelect, onNavigate, className, classNames, ...props }: CalendarMonthGridProps) {
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
    return (<div role="grid" {...props} data-view="month" className={[classNames?.grid, className].filter(Boolean).join(" ")}>
      {rows.map((row) => (<div role="row" key={toISODate(row[0])} data-cols="3" className={classNames?.week}>
          {row.map((month) => (<button key={toISODate(month)} type="button" role="gridcell" aria-selected={value?.getFullYear() === month.getFullYear() && value?.getMonth() === month.getMonth()} data-month={toISODate(month)} tabIndex={toISODate(month) === tabStopDate ? 0 : -1} disabled={isMonthDisabled?.(month)} onClick={onSelect ? () => onSelect(month) : undefined} onKeyDown={handleKeyDown(month)} className={classNames?.day}>
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
    className?: string;
    classNames?: Pick<CalendarClassNames, "grid" | "week" | "day">;
}
export function CalendarYearGrid({ visibleMonth, value, isYearDisabled, onSelect, onNavigate, className, classNames, ...props }: CalendarYearGridProps) {
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
    return (<div role="grid" {...props} data-view="year" className={[classNames?.grid, className].filter(Boolean).join(" ")}>
      {rows.map((row) => (<div role="row" key={toISODate(row[0])} data-cols="3" className={classNames?.week}>
          {row.map((year) => (<button key={year.getFullYear()} type="button" role="gridcell" aria-selected={value?.getFullYear() === year.getFullYear()} data-year={year.getFullYear()} tabIndex={year.getFullYear() === tabStopYear ? 0 : -1} disabled={isYearDisabled?.(year)} onClick={onSelect ? () => onSelect(year) : undefined} onKeyDown={handleKeyDown(year)} className={classNames?.day}>
              {year.getFullYear()}
            </button>))}
        </div>))}
    </div>);
}
export type CalendarView = "days" | "months" | "years";
export interface CalendarProps extends Omit<React.ComponentProps<"div">, "className" | "defaultValue" | "onChange"> {
    value?: Date | null;
    defaultValue?: Date | null;
    range?: CalendarRange;
    weekdayLabels?: string[];
    monthLabels?: string[];
    visibleMonth: Date;
    view?: CalendarView;
    defaultView?: CalendarView;
    onChange?: (date: Date) => void;
    onVisibleMonthChange?: (month: Date) => void;
    onViewChange?: (view: CalendarView) => void;
    onMonthSelect?: (month: Date) => void;
    onYearSelect?: (year: Date) => void;
    onHoverDateChange?: (date: Date | null) => void;
    isDateDisabled?: (date: Date) => boolean;
    firstDayOfWeek?: 0 | 1;
    className?: string;
    classNames?: CalendarClassNames;
}
export function Calendar({ value: controlledValue, defaultValue, range, weekdayLabels, monthLabels, visibleMonth, view: controlledView, defaultView, onChange, onVisibleMonthChange, onViewChange, onMonthSelect, onYearSelect, onHoverDateChange, isDateDisabled, firstDayOfWeek = 0, className, classNames, ...props }: CalendarProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const pendingFocusRef = React.useRef<{
        attribute: string;
        value: string;
        dir?: 1 | -1;
        tries?: number;
    } | null>(null);
    const [uncontrolledValue, setValue] = React.useState<Date | null>(defaultValue ?? null);
    const [uncontrolledView, setView] = React.useState<CalendarView>(defaultView ?? "days");
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const isViewControlled = controlledView !== undefined;
    const view = isViewControlled ? controlledView : uncontrolledView;
    const weeks = React.useMemo(() => {
        const firstOfMonth = startOfMonth(visibleMonth);
        const offset = firstDayOfWeek === 1 ? (firstOfMonth.getDay() + 6) % 7 : firstOfMonth.getDay();
        const start = addDays(firstOfMonth, -offset);
        const weekCount = Math.ceil((offset + daysInMonth(visibleMonth.getFullYear(), visibleMonth.getMonth())) / 7);
        return Array.from({ length: weekCount }, (_, weekIndex) => Array.from({ length: 7 }, (day, dayIndex) => addDays(start, weekIndex * 7 + dayIndex)));
    }, [visibleMonth, firstDayOfWeek]);
    const handleViewChange = (next: CalendarView) => {
        if (!isViewControlled)
            setView(next);
        onViewChange?.(next);
    };
    const selectStateRef = React.useRef({ visibleMonth, isControlled, isDateDisabled, onChange, onVisibleMonthChange });
    React.useEffect(() => {
        selectStateRef.current = { visibleMonth, isControlled, isDateDisabled, onChange, onVisibleMonthChange };
    });
    const handleSelect = React.useCallback((date: Date) => {
        const state = selectStateRef.current;
        const outside = date.getFullYear() !== state.visibleMonth.getFullYear() || date.getMonth() !== state.visibleMonth.getMonth();
        if (outside)
            state.onVisibleMonthChange?.(startOfMonth(date));
        if (!state.isControlled)
            setValue(date);
        state.onChange?.(date);
    }, []);
    const handleNavigate = React.useCallback((date: Date) => {
        const state = selectStateRef.current;
        const dir: 1 | -1 = date.getTime() >= state.visibleMonth.getTime() ? 1 : -1;
        if (state.isDateDisabled) {
            let probe = date;
            let found = !state.isDateDisabled(probe);
            for (let i = 0; i < 90 && !found; i++) {
                probe = dir === 1 ? addDays(probe, 1) : addDays(probe, -1);
                found = !state.isDateDisabled(probe);
            }
            if (!found)
                return;
        }
        pendingFocusRef.current = {
            attribute: "data-date",
            value: toISODate(date),
            dir,
        };
        state.onVisibleMonthChange?.(startOfMonth(date));
    }, []);
    const hoverRef = React.useRef(onHoverDateChange);
    React.useEffect(() => {
        hoverRef.current = onHoverDateChange;
    });
    const emitHover = React.useCallback((date: Date | null) => {
        hoverRef.current?.(date);
    }, []);
    const queueGridFocusAfterPageTurn = (targetMonth: Date) => {
        const focusedDate = rootRef.current?.querySelector<HTMLButtonElement>('[role="grid"] button:focus')?.dataset.date;
        const anchorDay = focusedDate ? Number(focusedDate.slice(8, 10)) : 1;
        const day = Math.min(Number.isNaN(anchorDay) ? 1 : anchorDay, daysInMonth(targetMonth.getFullYear(), targetMonth.getMonth()));
        pendingFocusRef.current = { attribute: "data-date", value: toISODate(dateFromParts(targetMonth.getFullYear(), targetMonth.getMonth(), day)) };
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
        const grid = rootRef.current?.querySelector<HTMLElement>('[role="grid"]');
        if (!grid)
            return;
        const cells = [...grid.querySelectorAll<HTMLButtonElement>(`button[${target.attribute}]`)];
        const wanted = grid.querySelector<HTMLButtonElement>(`button[${target.attribute}="${target.value}"]`);
        const index = wanted ? cells.indexOf(wanted) : -1;
        const forward = index >= 0 ? cells.slice(index) : cells;
        const usable = forward.find((b) => !b.disabled) ?? cells.toReversed().find((b) => !b.disabled);
        if (usable) {
            usable.focus();
            return;
        }
        if (target.dir && (target.tries ?? 0) < 12) {
            const nextMonth = addMonths(visibleMonth, target.dir);
            pendingFocusRef.current = {
                attribute: target.attribute,
                value: toISODate(startOfMonth(nextMonth)),
                dir: target.dir,
                tries: (target.tries ?? 0) + 1,
            };
            onVisibleMonthChange?.(startOfMonth(nextMonth));
        }
    });
    const handlePrevious = () => {
        const target = view === "days" ? addMonths(visibleMonth, -1) : view === "months" ? addYears(visibleMonth, -1) : addYears(visibleMonth, -12);
        queueGridFocusAfterPageTurn(target);
        onVisibleMonthChange?.(target);
    };
    const handleNext = () => {
        const target = view === "days" ? addMonths(visibleMonth, 1) : view === "months" ? addYears(visibleMonth, 1) : addYears(visibleMonth, 12);
        queueGridFocusAfterPageTurn(target);
        onVisibleMonthChange?.(target);
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
      <CalendarHeader className={classNames?.header} onKeyDown={handleHeaderKeyDown}>
        <CalendarNavButton className={classNames?.nav} classNames={{ icon: classNames?.navIcon }} direction="previous" aria-label={`Previous ${navUnit}`} onClick={handlePrevious}/>
        <div className={classNames?.titleRow}>
          <CalendarTitleButton className={classNames?.title} data-active={view === "years" || undefined} onClick={() => handleViewChange("years")}>
            {visibleMonth.getFullYear()}
          </CalendarTitleButton>
          <CalendarTitleButton className={classNames?.title} data-active={view === "months" || undefined} onClick={() => handleViewChange("months")}>
            {monthLabels?.[visibleMonth.getMonth()] ?? Calendar.calendarMonthLabels[visibleMonth.getMonth()]}
          </CalendarTitleButton>
        </div>
        <CalendarNavButton className={classNames?.nav} classNames={{ icon: classNames?.navIcon }} direction="next" aria-label={`Next ${navUnit}`} onClick={handleNext}/>
      </CalendarHeader>
      {view === "days" && (<CalendarGrid weeks={weeks} visibleMonth={visibleMonth} value={value} range={range} weekdayLabels={weekdayLabels} isDateDisabled={isDateDisabled} onSelect={handleSelect} onNavigate={handleNavigate} onHoverDateChange={onHoverDateChange ? emitHover : undefined} firstDayOfWeek={firstDayOfWeek} classNames={{ grid: classNames?.grid, week: classNames?.week, weekday: classNames?.weekday, day: classNames?.day }}/>)}
      {view === "months" && (<CalendarMonthGrid visibleMonth={visibleMonth} value={value} onSelect={handleMonthSelect} onNavigate={handleMonthNavigate} classNames={{ grid: classNames?.grid, week: classNames?.week, day: classNames?.day }}/>)}
      {view === "years" && (<CalendarYearGrid visibleMonth={visibleMonth} value={value} onSelect={handleYearSelect} onNavigate={handleYearNavigate} classNames={{ grid: classNames?.grid, week: classNames?.week, day: classNames?.day }}/>)}
    </CalendarRoot>);
}
Calendar.calendarMonthLabels = calendarMonthLabels;
