"use client";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { type CalendarView, Calendar } from "./calendar";
import { type ClassNameValue, cn } from "../utils/cn";
import { Picker } from "./picker";
import { usePanelFocus } from "../utils/use-panel-focus";
import {
    currentDate,
    dateFromParts,
    parseISODate,
    startOfMonth,
    toISODate,
} from "../utils/date-math";
type ParsedInput = {
    kind: "empty";
} | {
    kind: "invalid";
} | {
    kind: "year";
    year: string;
} | {
    kind: "yearMonth";
    normalized: string;
    firstOfMonth: Date;
} | {
    kind: "full";
    normalized: string;
    date: Date;
};
function parseInput(raw: string): ParsedInput {
    const normalized = raw
        .trim()
        .split(/[\s,/，]+/)
        .filter(Boolean)
        .join("-");
    if (normalized === "")
        return { kind: "empty" };
    const parts = normalized.split("-");
    const isDigits = (s: string) => /^\d+$/.test(s);
    if (parts.length === 1) {
        if (parts[0].length === 4 && isDigits(parts[0]))
            return { kind: "year", year: parts[0] };
        return { kind: "invalid" };
    }
    if (parts.length === 2) {
        const [y, m] = parts;
        const month = Number(m);
        if (y.length === 4 && isDigits(y) && isDigits(m) && month >= 1 && month <= 12) {
            const mm = m.padStart(2, "0");
            return {
                kind: "yearMonth",
                normalized: `${y}-${mm}`,
                firstOfMonth: dateFromParts(Number(y), month - 1, 1),
            };
        }
        return { kind: "invalid" };
    }
    if (parts.length === 3) {
        const [y, m, d] = parts;
        if (y.length !== 4 || !isDigits(y) || !isDigits(m) || !isDigits(d))
            return { kind: "invalid" };
        const mm = m.padStart(2, "0");
        const dd = d.padStart(2, "0");
        const date = parseISODate(`${y}-${mm}-${dd}`);
        if (!date)
            return { kind: "invalid" };
        return { kind: "full", normalized: `${y}-${mm}-${dd}`, date };
    }
    return { kind: "invalid" };
}
export interface DatePickerProps {
    value?: Date | null;
    defaultValue?: Date | null;
    onValueChange?: (date: Date) => void;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    firstDayOfWeek?: 0 | 1;
    isDateDisabled?: (date: Date) => boolean;
    trailing?: React.ReactNode;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    classNames?: {
        input?: ClassNameValue;
        trailing?: ClassNameValue;
        panel?: ClassNameValue;
    };
    styles?: {
        input?: React.CSSProperties;
        trailing?: React.CSSProperties;
    };
}
export function DatePicker({ value, defaultValue, onValueChange, placeholder = "Select or type a date", disabled, invalid, firstDayOfWeek = 0, isDateDisabled, trailing = <CalendarIcon className="size-4 text-muted-foreground"/>, onKeyDown, classNames, styles, }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState(() => (value ?? defaultValue) ? toISODate(value ?? defaultValue!) : "");
    const [selected, setSelected] = React.useState<Date | null>(() => value ?? defaultValue ?? null);
    const [visibleMonth, setVisibleMonth] = React.useState<Date>(() => startOfMonth(value ?? defaultValue ?? currentDate()));
    const [view, setView] = React.useState<CalendarView>("days");
    const [hasError, setHasError] = React.useState(false);
    const committedRef = React.useRef<string | null>(defaultValue ? toISODate(defaultValue) : null);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const handlePanelArrowKeys = usePanelFocus({ open, panelRef });
    React.useEffect(() => {
        if (value === undefined)
            return;
        committedRef.current = value ? toISODate(value) : null;
        setSelected(value);
        setText(value ? toISODate(value) : "");
        if (value) {
            setVisibleMonth(startOfMonth(value));
            setView("days");
        }
    }, [value]);
    const commit = (date: Date) => {
        setSelected(date);
        setVisibleMonth(startOfMonth(date));
        setText(toISODate(date));
        setView("days");
        setOpen(false);
        committedRef.current = toISODate(date);
        onValueChange?.(date);
    };
    const handleTextChange = (next: string) => {
        setText(next);
        setHasError(false);
        const parsed = parseInput(next);
        if (parsed.kind === "full") {
            setSelected(parsed.date);
            setVisibleMonth(startOfMonth(parsed.date));
        }
    };
    const applyParsed = (parsed: ParsedInput) => {
        switch (parsed.kind) {
            case "empty":
                setHasError(false);
                return;
            case "invalid":
                setText("");
                setHasError(true);
                return;
            case "year":
                setVisibleMonth(dateFromParts(Number(parsed.year), 0, 1));
                setView("months");
                setText(parsed.year);
                setOpen(true);
                return;
            case "yearMonth":
                setVisibleMonth(parsed.firstOfMonth);
                setView("days");
                setText(parsed.normalized);
                setOpen(true);
                return;
            case "full":
                if (parsed.normalized === committedRef.current) {
                    setText(parsed.normalized);
                    setOpen(false);
                    return;
                }
                commit(parsed.date);
                return;
        }
    };
    const handleEnter = () => {
        applyParsed(parseInput(text));
    };
    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next)
            applyParsed(parseInput(text));
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented)
            return;
        handlePanelArrowKeys(e);
        if (e.defaultPrevented)
            return;
        if (e.key === "Enter") {
            e.preventDefault();
            handleEnter();
        }
    };
    const handleMonthSelect = (month: Date) => {
        setHasError(false);
        setText(`${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`);
    };
    const handleYearSelect = (year: Date) => {
        setHasError(false);
        setText(String(year.getFullYear()));
    };
    return (<Picker open={open} onOpenChange={handleOpenChange} panelRef={panelRef} value={text} onValueChange={handleTextChange} placeholder={placeholder} disabled={disabled} aria-invalid={(hasError || invalid) || undefined} trailing={trailing} onKeyDown={handleKeyDown} classNames={{ input: classNames?.input, trailing: classNames?.trailing }} styles={{ input: styles?.input, trailing: styles?.trailing }}>
      <Calendar value={selected} visibleMonth={visibleMonth} onVisibleMonthChange={setVisibleMonth} onChange={commit} view={view} onViewChange={setView} onMonthSelect={handleMonthSelect} onYearSelect={handleYearSelect} isDateDisabled={isDateDisabled} firstDayOfWeek={firstDayOfWeek} className={cn(classNames?.panel)}/>
    </Picker>);
}
