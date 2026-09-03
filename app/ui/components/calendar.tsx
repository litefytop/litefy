"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ClassNameValue, cn } from "..";

export interface CalendarRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function CalendarRoot({ className, ...props }: CalendarRootProps) {
  return (
    <div
      {...props}
      className={cn(
        "inline-flex flex-col gap-2 rounded-lg border border-border bg-background p-3",
        className,
      )}
    />
  );
}

export interface CalendarHeaderProps extends Omit<
  React.ComponentProps<"header">,
  "className" | "title"
> {
  title: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: ClassNameValue;
}

export function CalendarHeader({
  title,
  onPrevious,
  onNext,
  className,
  ...props
}: CalendarHeaderProps) {
  return (
    <header {...props} className={cn("flex items-center justify-between gap-2", className)}>
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous month"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
      </button>
      <div className="flex-1 text-center text-sm font-medium">{title}</div>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next month"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground cursor-pointer transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronRight className="size-4" />
      </button>
    </header>
  );
}

export interface CalendarGridProps extends Omit<
  React.ComponentProps<"div">,
  "className" | "onSelect"
> {
  weeks: Temporal.PlainDate[][];
  visibleMonth: Temporal.PlainDate;
  value?: Temporal.PlainDate | null;
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;
  onSelect?: (date: Temporal.PlainDate) => void;
  onNavigate?: (date: Temporal.PlainDate) => void;
  firstDayOfWeek?: 0 | 1;
  className?: ClassNameValue;
}

export function CalendarGrid({
  weeks,
  visibleMonth,
  value,
  isDateDisabled,
  onSelect,
  onNavigate,
  firstDayOfWeek = 0,
  className,
  ...props
}: CalendarGridProps) {
  const weekdayLabels =
    firstDayOfWeek === 1
      ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
      : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const inMonth =
    value && value.year === visibleMonth.year && value.month === visibleMonth.month
      ? value
      : visibleMonth.with({ day: 1 });
  const tabStopDate = inMonth.toString();

  return (
    <div role="grid" {...props} className={cn("grid grid-cols-7 gap-y-1", className)}>
      <div role="row" className="col-span-7 grid grid-cols-7">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            role="columnheader"
            className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <CalendarGridRow
          key={index}
          week={week}
          visibleMonth={visibleMonth}
          value={value}
          isDateDisabled={isDateDisabled}
          onSelect={onSelect}
          onNavigate={onNavigate}
          tabStopDate={tabStopDate}
          className="col-span-7"
        />
      ))}
    </div>
  );
}

export interface CalendarGridRowProps extends Omit<
  React.ComponentProps<"div">,
  "className" | "onSelect"
> {
  week: Temporal.PlainDate[];
  visibleMonth: Temporal.PlainDate;
  value?: Temporal.PlainDate | null;
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;
  onSelect?: (date: Temporal.PlainDate) => void;
  onNavigate?: (date: Temporal.PlainDate) => void;
  tabStopDate?: string;
  className?: ClassNameValue;
}

export function CalendarGridRow({
  week,
  visibleMonth,
  value,
  isDateDisabled,
  onSelect,
  onNavigate,
  tabStopDate,
  className,
  ...props
}: CalendarGridRowProps) {
  return (
    <div role="row" {...props} className={cn("grid grid-cols-7", className)}>
      {week.map((date) => (
        <CalendarGridCell
          key={date.toString()}
          date={date}
          outsideMonth={date.year !== visibleMonth.year || date.month !== visibleMonth.month}
          selected={value?.equals(date) ?? false}
          disabled={isDateDisabled?.(date) ?? false}
          tabStop={tabStopDate === undefined ? undefined : date.toString() === tabStopDate}
          onClick={onSelect ? () => onSelect(date) : undefined}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

export interface CalendarGridCellProps extends Omit<
  React.ComponentProps<"button">,
  "className" | "type"
> {
  date: Temporal.PlainDate;
  outsideMonth?: boolean;
  selected?: boolean;
  tabStop?: boolean;
  onNavigate?: (date: Temporal.PlainDate) => void;
  className?: ClassNameValue;
}

const dayOffsets: Record<string, number> = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: 7,
  ArrowUp: -7,
};

export function CalendarGridCell({
  date,
  outsideMonth,
  selected,
  tabStop,
  onNavigate,
  className,
  onKeyDown: onKeyDownProp,
  ...props
}: CalendarGridCellProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDownProp?.(e);
    if (e.defaultPrevented) return;
    const offset = dayOffsets[e.key];
    if (!offset) return;
    e.preventDefault();
    const grid = e.currentTarget.closest('[role="grid"]');
    if (!grid) return;
    let next = date;
    for (let i = 0; i < 31; i++) {
      next = next.add({ days: offset });
      const btn = grid.querySelector<HTMLButtonElement>(`button[data-date="${next.toString()}"]`);
      if (!btn) {
        onNavigate?.(next);
        return;
      }
      if (btn.disabled) continue;
      btn.focus();
      return;
    }
  };

  return (
    <button
      type="button"
      role="gridcell"
      aria-selected={selected}
      data-outside-month={outsideMonth || undefined}
      data-date={date.toString()}
      tabIndex={tabStop === undefined ? undefined : tabStop ? 0 : -1}
      {...props}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm tabular-nums cursor-pointer select-none",
        "transition-colors hover:bg-muted",
        "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-outside-month:opacity-40",
        className,
      )}
    >
      {date.day}
    </button>
  );
}

export interface CalendarProps {
  value?: Temporal.PlainDate | null;
  defaultValue?: Temporal.PlainDate | null;
  visibleMonth: Temporal.PlainDate;
  onChange?: (date: Temporal.PlainDate) => void;
  onVisibleMonthChange?: (month: Temporal.PlainDate) => void;
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;
  firstDayOfWeek?: 0 | 1;
  className?: ClassNameValue;
}

export function Calendar({
  value: controlledValue,
  defaultValue,
  visibleMonth,
  onChange,
  onVisibleMonthChange,
  isDateDisabled,
  firstDayOfWeek = 0,
  className,
}: CalendarProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const pendingFocusRef = React.useRef<string | null>(null);
  const [uncontrolledValue, setValue] = React.useState<Temporal.PlainDate | null>(
    defaultValue ?? null,
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const firstOfMonth = visibleMonth.with({ day: 1 });
  const offset = firstDayOfWeek === 1 ? firstOfMonth.dayOfWeek - 1 : firstOfMonth.dayOfWeek % 7;
  const start = firstOfMonth.subtract({ days: offset });
  const weekCount = Math.ceil((offset + visibleMonth.daysInMonth) / 7);
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => start.add({ days: weekIndex * 7 + dayIndex })),
  );

  const handleSelect = (date: Temporal.PlainDate) => {
    if (date.year !== visibleMonth.year || date.month !== visibleMonth.month) return;
    if (!isControlled) setValue(date);
    onChange?.(date);
  };

  const handleNavigate = (date: Temporal.PlainDate) => {
    pendingFocusRef.current = date.toString();
    onVisibleMonthChange?.(date.with({ day: 1 }));
  };

  React.useEffect(() => {
    const target = pendingFocusRef.current;
    if (!target) return;
    pendingFocusRef.current = null;
    rootRef.current?.querySelector<HTMLButtonElement>(`button[data-date="${target}"]`)?.focus();
  });

  const handlePreviousMonth = () => {
    onVisibleMonthChange?.(visibleMonth.subtract({ months: 1 }));
  };

  const handleNextMonth = () => {
    onVisibleMonthChange?.(visibleMonth.add({ months: 1 }));
  };

  return (
    <CalendarRoot ref={rootRef} className={className}>
      <CalendarHeader
        title={`${visibleMonth.year} / ${visibleMonth.month}`}
        onPrevious={handlePreviousMonth}
        onNext={handleNextMonth}
      />
      <CalendarGrid
        weeks={weeks}
        visibleMonth={visibleMonth}
        value={value}
        isDateDisabled={isDateDisabled}
        onSelect={handleSelect}
        onNavigate={handleNavigate}
        firstDayOfWeek={firstDayOfWeek}
      />
    </CalendarRoot>
  );
}
