"use client";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { type CalendarView, type ClassNameValue, cn, Calendar, Picker, usePanelFocus } from "..";

type ParsedInput =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "year"; year: string }
  | { kind: "yearMonth"; normalized: string; firstOfMonth: Temporal.PlainDate }
  | { kind: "full"; normalized: string; date: Temporal.PlainDate };

// Accepts space, "-", "/", "," (and full-width comma) as date separators;
// normalizes to the canonical YYYY-MM-DD form, padding 1-digit parts.
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
  // The last value reported through onValueChange — typing previews update the
  // selection without committing, so dedup must compare against this, not selected.
  const committedRef = React.useRef<string | null>(defaultValue?.toString() ?? null);
  // Real-focus branch: when the panel is open, ArrowDown / ArrowUp hand focus
  // to the calendar's own buttons, so typing and calendar navigation never
  // compete for the input.
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

  // Typing previews live: separators are tolerated, a complete date syncs the
  // selection and the visible month before any validation runs.
  const handleTextChange = (next: string) => {
    setText(next);
    const parsed = parseInput(next);
    if (parsed.kind === "full") {
      setSelected(parsed.date);
      setVisibleMonth(parsed.date.with({ day: 1 }));
    }
  };

  const applyParsed = (parsed: ParsedInput) => {
    switch (parsed.kind) {
      case "empty":
        return;
      case "invalid":
        setText("");
        return;
      case "year":
        setVisibleMonth(Temporal.PlainDate.from(`${parsed.year}-01-01`));
        setView("months");
        setText(parsed.year);
        return;
      case "yearMonth":
        setVisibleMonth(parsed.firstOfMonth);
        setView("days");
        setText(parsed.normalized);
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

  // Enter validates the typed text: a complete date commits, a partial one
  // opens the matching calendar view, invalid clears the input.
  const handleEnter = () => {
    applyParsed(parseInput(text));
  };

  // Closing the panel (outside click / Escape) validates the same way, so a
  // half-typed date never survives as garbage in the input.
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

  return (
    <Picker
      open={open}
      onOpenChange={handleOpenChange}
      panelRef={panelRef}
      value={text}
      onValueChange={handleTextChange}
      placeholder={placeholder}
      disabled={disabled}
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
        isDateDisabled={isDateDisabled}
        firstDayOfWeek={firstDayOfWeek}
        className={cn(classNames?.panel)}
      />
    </Picker>
  );
}
