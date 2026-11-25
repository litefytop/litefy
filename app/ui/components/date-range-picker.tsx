"use client";
import * as React from "react";
import { Calendar as CalendarIcon, X as CloseIcon } from "./icons";
import { type CalendarClassNames, type CalendarRange, type CalendarView, Calendar } from "./calendar";
import { Picker } from "./picker";
import { usePanelFocus } from "../utils/use-panel-focus";
import {
    currentDate,
    parseISODate,
    startOfMonth,
    toISODate,
} from "../utils/date-math";
import { type DateRangeValue } from "../utils/filter-query";

export interface DateRangePickerClassNames {
    root?: string;
    input?: string;
    trailing?: string;
    trailingClose?: string;
    popover?: string;
    panel?: string;
    invalid?: string;
    calendar?: CalendarClassNames;
}

export interface DateRangePickerStyles {
    root?: React.CSSProperties;
    input?: React.CSSProperties;
    trailing?: React.CSSProperties;
    popover?: React.CSSProperties;
    panel?: React.CSSProperties;
    invalid?: React.CSSProperties;
}

export interface DateRangePickerProps {
    value?: DateRangeValue;
    defaultValue?: DateRangeValue;
    onValueChange?: (value: DateRangeValue) => void;
    placeholder?: string;
    startLabel?: string;
    endLabel?: string;
    separator?: string;
    clearText?: string;
    invalidText?: string;
    weekdayLabels?: string[];
    monthLabels?: string[];
    isDateDisabled?: (date: Date) => boolean;
    firstDayOfWeek?: 0 | 1;
    disabled?: boolean;
    className?: string;
    classNames?: DateRangePickerClassNames;
    styles?: DateRangePickerStyles;
}

const EMPTY: DateRangeValue = { start: null, end: null };

function toRange(value: DateRangeValue): CalendarRange {
    return {
        start: value.start ? parseISODate(value.start) : null,
        end: value.end ? parseISODate(value.end) : null,
    };
}

export function DateRangePicker({
    value: controlledValue,
    defaultValue,
    onValueChange,
    placeholder = "Select a date range",
    startLabel = "Start date",
    endLabel = "End date",
    separator = "–",
    clearText = "Clear",
    invalidText = "Start must not exceed end",
    weekdayLabels,
    monthLabels,
    isDateDisabled,
    firstDayOfWeek = 0,
    disabled,
    className,
    classNames,
    styles,
}: DateRangePickerProps) {
    const [internal, setInternal] = React.useState<DateRangeValue>(() => defaultValue ?? EMPTY);
    const value = controlledValue ?? internal;
    const [open, setOpen] = React.useState(false);
    const [picking, setPicking] = React.useState<"start" | "end">("start");
    const [selected, setSelected] = React.useState<CalendarRange>(() => toRange(value));
    const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);
    const [visibleMonth, setVisibleMonth] = React.useState<Date>(() => {
        const range = toRange(value);
        return startOfMonth(range.start ?? currentDate());
    });
    const [view, setView] = React.useState<CalendarView>("days");
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const handlePanelArrowKeys = usePanelFocus({ open, panelRef });
    const signature = `${value.start ?? ""}|${value.end ?? ""}`;

    const [prevSignature, setPrevSignature] = React.useState(signature);
    if (signature !== prevSignature) {
        setPrevSignature(signature);
        const range = toRange(value);
        setSelected(range);
        if (range.start) setVisibleMonth(startOfMonth(range.start));
    }

    const commit = (next: DateRangeValue) => {
        if (disabled) return;
        if (controlledValue === undefined) setInternal(next);
        onValueChange?.(next);
    };

    const display = value.start && value.end
        ? `${value.start} ${separator} ${value.end}`
        : value.start
            ? `≥ ${value.start}`
            : value.end
                ? `≤ ${value.end}`
                : "";

    const handleSelect = (date: Date) => {
        if (disabled) return;
        if (picking === "start" || selected.end) {
            setSelected({ start: date, end: null });
            setHoveredDate(null);
            setPicking("end");
            return;
        }
        if (selected.start && date.getTime() < selected.start.getTime()) {
            setSelected({ start: date, end: null });
            setHoveredDate(null);
            setPicking("end");
            return;
        }
        const start = selected.start ?? date;
        setSelected({ start, end: date });
        setHoveredDate(null);
        commit({ start: toISODate(start), end: toISODate(date) });
        setPicking("start");
        setOpen(false);
    };

    const clearValue = () => {
        if (disabled || (!value.start && !value.end)) return;
        setSelected({ start: null, end: null });
        setHoveredDate(null);
        setPicking("start");
        commit({ start: null, end: null });
    };

    const handleOpenChange = (next: boolean) => {
        if (disabled && next) return;
        setOpen(next);
        if (!next) setHoveredDate(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (e.key === "Backspace") {
            if (value.start || value.end) {
                e.preventDefault();
                clearValue();
            }
            return;
        }
        handlePanelArrowKeys(e);
    };

    const previewRange: CalendarRange = selected.end || !selected.start
        ? selected
        : { start: selected.start, end: hoveredDate };

    const rangeInvalid = !!(selected.start && selected.end && selected.end < selected.start);

    return (
        <Picker
            open={open}
            onOpenChange={handleOpenChange}
            panelRef={panelRef}
            value={display}
            onValueChange={() => {}}
            readOnly
            placeholder={placeholder}
            disabled={disabled}
            aria-label={`${startLabel} ${separator} ${endLabel}`}
            trailing={open ? (
                <button type="button" disabled={disabled} aria-label={clearText} className={classNames?.trailingClose} onClick={clearValue}>
                    <CloseIcon aria-hidden />
                </button>
            ) : (
                <CalendarIcon aria-hidden />
            )}
            onKeyDown={handleKeyDown}
            matchPanelWidth={false}
            className={[classNames?.root, className].filter(Boolean).join(" ") || undefined}
            style={styles?.root}
            classNames={{ input: classNames?.input, trailing: classNames?.trailing, popover: classNames?.popover }}
            styles={{ input: styles?.input, trailing: styles?.trailing, popover: styles?.popover }}
        >
            <div className={classNames?.panel} style={styles?.panel} data-slot="date-range-panel">
                <Calendar
                    disabled={disabled}
                    className={classNames?.panel}
                    value={selected.start}
                    range={previewRange}
                    weekdayLabels={weekdayLabels}
                    monthLabels={monthLabels}
                    visibleMonth={visibleMonth}
                    view={view}
                    onChange={handleSelect}
                    onVisibleMonthChange={setVisibleMonth}
                    onViewChange={setView}
                    onHoverDateChange={setHoveredDate}
                    isDateDisabled={isDateDisabled}
                    firstDayOfWeek={firstDayOfWeek}
                    classNames={classNames?.calendar}
                />
                <div className={classNames?.invalid} style={styles?.invalid} role="alert">
                    {rangeInvalid ? invalidText : ""}
                </div>
            </div>
        </Picker>
    );
}
