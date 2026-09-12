"use client";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { type CalendarView, Calendar } from "./calendar";
import { type ClassNameValue, cn } from "../utils/cn";
import { Picker } from "./picker";
import { usePanelFocus } from "../utils/use-panel-focus";

type ParsedInput =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "year"; year: string }
  | { kind: "yearMonth"; normalized: string; firstOfMonth: Temporal.PlainDate }
  | { kind: "full"; normalized: string; date: Temporal.PlainDate };

function parseInput(raw: string): ParsedInput {
  const normalized = raw
    .trim()
    .split(/[\s,/，]+/)
    .filter(Boolean)
    .join("-");
  if (normalized === "") return { kind: "empty" };
  const parts = normalized.split("-");
  const isDigits = (s: string) => /^\d+$/.test(s);
  if (parts.length === 1) {
    if (parts[0].length === 4 && isDigits(parts[0])) return { kind: "year", year: parts[0] };
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
        firstOfMonth: Temporal.PlainDate.from(`${y}-${mm}-01`),
      };
    }
    return { kind: "invalid" };
  }
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (y.length !== 4 || !isDigits(y) || !isDigits(m) || !isDigits(d)) return { kind: "invalid" };
    const mm = m.padStart(2, "0");
    const dd = d.padStart(2, "0");
    try {
      const date = Temporal.PlainDate.from(`${y}-${mm}-${dd}`);
      return { kind: "full", normalized: `${y}-${mm}-${dd}`, date };
    } catch {
      return { kind: "invalid" };
    }
  }
  return { kind: "invalid" };
}

export interface DatePickerProps {
  value?: Temporal.PlainDate | null;
  defaultValue?: Temporal.PlainDate | null;
  onValueChange?: (date: Temporal.PlainDate) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  firstDayOfWeek?: 0 | 1;
  isDateDisabled?: (date: Temporal.PlainDate) => boolean;
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

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select or type a date",
  disabled,
  invalid,
  firstDayOfWeek = 0,
  isDateDisabled,
  trailing = <CalendarIcon className="size-4 text-muted-foreground" />,
  onKeyDown,
  classNames,
  styles,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(() => (value ?? defaultValue)?.toString() ?? "");
  const [selected, setSelected] = React.useState<Temporal.PlainDate | null>(
    () => value ?? defaultValue ?? null,
  );
  const [visibleMonth, setVisibleMonth] = React.useState<Temporal.PlainDate>(() =>
    (value ?? defaultValue ?? Temporal.Now.plainDateISO()).with({ day: 1 }),
  );
  const [view, setView] = React.useState<CalendarView>("days");
  const [hasError, setHasError] = React.useState(false);
  const committedRef = React.useRef<string | null>(defaultValue?.toString() ?? null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const handlePanelArrowKeys = usePanelFocus({ open, panelRef });

  React.useEffect(() => {
    if (value === undefined) return;
    committedRef.current = value?.toString() ?? null;
    setSelected(value);
    setText(value?.toString() ?? "");
    if (value) {
      setVisibleMonth(value.with({ day: 1 }));
      setView("days");
    }
  }, [value]);

  const commit = (date: Temporal.PlainDate) => {
    setSelected(date);
    setVisibleMonth(date.with({ day: 1 }));
    setText(date.toString());
    setView("days");
    setOpen(false);
    committedRef.current = date.toString();
    onValueChange?.(date);
  };

  const handleTextChange = (next: string) => {
    setText(next);
    setHasError(false);
    const parsed = parseInput(next);
    if (parsed.kind === "full") {
      setSelected(parsed.date);
      setVisibleMonth(parsed.date.with({ day: 1 }));
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
        setVisibleMonth(Temporal.PlainDate.from(`${parsed.year}-01-01`));
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
    if (!next) applyParsed(parseInput(text));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    handlePanelArrowKeys(e);
    if (e.defaultPrevented) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    }
  };

  const handleMonthSelect = (month: Temporal.PlainDate) => {
    setHasError(false);
    setText(`${month.year}-${String(month.month).padStart(2, "0")}`);
  };

  const handleYearSelect = (year: Temporal.PlainDate) => {
    setHasError(false);
    setText(String(year.year));
  };

  return (
    <Picker
      open={open}
      onOpenChange={handleOpenChange}
      panelRef={panelRef}
      value={text}
      onValueChange={handleTextChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={(hasError || invalid) || undefined}
      trailing={trailing}
      onKeyDown={handleKeyDown}
      classNames={{ input: classNames?.input, trailing: classNames?.trailing }}
      styles={{ input: styles?.input, trailing: styles?.trailing }}
    >
      <Calendar
        value={selected}
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        onChange={commit}
        view={view}
        onViewChange={setView}
        onMonthSelect={handleMonthSelect}
        onYearSelect={handleYearSelect}
        isDateDisabled={isDateDisabled}
        firstDayOfWeek={firstDayOfWeek}
        className={cn(classNames?.panel)}
      />
    </Picker>
  );
}
