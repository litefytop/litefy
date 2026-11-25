import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { FilterCombobox as FilterComboboxHeadless, useTooltipWiring } from "@/ui";
import {
  buttonDisabledTextFaceClasses,
  buttonTextFaceClasses,
  buttonTextFieldClasses,
  Button,
} from "./button";
import { TooltipContent } from "./tooltip";
import type {
  FilterChipRenderArgs,
  FilterComboboxProps,
  FilterOptionRenderArgs,
} from "@/ui";
import { X } from "@/ui/components/icons";
import { cn, mergeSlots } from "../utils/cn";
import { fieldGroupBaseClasses } from "./input";

const filterIconButtonClasses = "size-7 shrink-0";
const filterTextButtonClasses = cn(
  buttonTextFieldClasses,
  buttonTextFaceClasses,
  "pure-icon",
  filterIconButtonClasses,
);
const filterTextButtonDisabledClasses = cn(
  buttonTextFieldClasses,
  buttonDisabledTextFaceClasses,
  "pure-icon",
  filterIconButtonClasses,
);
const clearLayoutClasses =
  "absolute right-1 top-1/2 size-control -translate-y-1/2";

const barLayoutClasses = "relative min-h-field flex-wrap gap-1 px-2 py-1 data-clear:pr-14";
const barClasses = cn(fieldGroupBaseClasses, barLayoutClasses);
const barDisabledClasses = cn(
  fieldGroupBaseClasses,
  barLayoutClasses,
  "cursor-not-allowed border-border bg-disabled text-disabled-fg shadow-frame",
);

const chipLayoutClasses =
  "inline-flex h-7 max-w-full min-w-0 shrink-0 items-center rounded-md border-hair px-1 text-sm";
const chipClasses = cn(
  chipLayoutClasses,
  "border-border bg-surface-raised text-surface-raised-fg",
);
const chipDisabledClasses = cn(
  chipLayoutClasses,
  "cursor-not-allowed border-border bg-disabled text-disabled-fg",
);

const draftLayoutClasses =
  "inline-flex h-7 max-w-full min-w-0 shrink-0 truncate items-center gap-x-0.5 whitespace-nowrap rounded-md border-hair border-dashed px-1 text-sm";
const draftClasses = cn(
  draftLayoutClasses,
  "border-border bg-surface-raised text-surface-raised-fg",
);
const draftDisabledClasses = cn(
  draftLayoutClasses,
  "border-border bg-disabled text-disabled-fg",
);

const inputLayoutClasses =
  "min-w-16 flex-[1_1_--spacing(32)] border-0 bg-transparent text-sm outline-none";
const inputClasses = cn(
  inputLayoutClasses,
  "text-foreground placeholder:text-foreground",
);
const inputDisabledClasses = cn(
  inputLayoutClasses,
  "cursor-not-allowed text-disabled-fg placeholder:text-disabled-fg",
);

const filterHintBaseClasses =
  "pointer-events-none absolute -top-7 right-0 z-10 flex items-center gap-x-2 whitespace-nowrap";
const filterHintFaceClasses =
  "rounded-sm border-frame border-border bg-surface-raised text-surface-raised-fg px-2 py-1 text-xs leading-4 tracking-label case-label shadow-subtle";
const hintDisabledClasses = cn(
  filterHintBaseClasses,
  "rounded-sm border-frame border-border bg-disabled px-2 py-1 text-xs leading-4 tracking-label case-label text-disabled-fg shadow-subtle",
);

export const filterComboboxClasses = {
  root: "flex w-full min-w-0 max-w-[20rem] flex-col gap-y-1 @container",
  bar: barClasses,
  chip: chipClasses,
  chipLabel: "h-full min-w-0 flex-1 justify-start text-left",
  chipRemove: filterIconButtonClasses,
  draft: draftClasses,
  input: inputClasses,
  list: "max-h-72 min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))] overflow-y-auto rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg shadow-elevated p-[var(--radius-md)]",
  option: "flex h-control cursor-pointer select-none items-center gap-x-2 px-3 text-sm text-foreground data-highlighted:bg-surface data-highlighted:text-surface-fg",
  optionLabel: "min-w-0 flex-1 truncate",
  optionDetail: "shrink-0 text-xs text-inherit",
  submit: filterTextButtonClasses,
  cancel: filterTextButtonClasses,
  clear: cn(filterTextButtonClasses, clearLayoutClasses),
  hint: cn(filterHintBaseClasses, filterHintFaceClasses),
  hintKeys: "inline-flex items-center gap-x-1",
  hintKey: "kbd",
  status: "min-h-5 text-sm text-foreground",
  error: "text-danger-independent",
};

function FilterChip({ label, texts, onEdit, onRemove, disabled, classNames }: FilterChipRenderArgs) {
  const uid = useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "");
  const popoverId = `filter-chip-tooltip-${uid}`;
  const anchorName = `--filter-chip-tooltip-${uid}`;
  const wiring = useTooltipWiring({ popoverId, anchorName, delay: 100 });
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPress = useRef(false);

  useEffect(() => () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  const clearPressTimer = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = null;
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    longPress.current = false;
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = null;
    if (event.pointerType === "mouse") return;
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      longPress.current = true;
      wiring.show();
    }, 450);
  };

  const handlePointerUp = () => {
    clearPressTimer();
    if (!longPress.current) return;
    dismissTimer.current = setTimeout(() => {
      dismissTimer.current = null;
      wiring.hide();
    }, 2000);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!longPress.current) {
      onEdit();
      return;
    }
    event.preventDefault();
    longPress.current = false;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") wiring.hide();
  };

  return (
    <>
      <span className={classNames?.chip} data-slot="chip">
        <Button
          type="button"
          data-variant="text"
          disabled={disabled}
          className={classNames?.chipLabel}
          aria-label={`${texts.editLabel}: ${label}`}
          aria-describedby={popoverId}
          onPointerEnter={(event) => { if (event.pointerType !== "touch") wiring.show(); }}
          onPointerLeave={(event) => { if (event.pointerType !== "touch") wiring.hide(); }}
          onFocus={wiring.show}
          onBlur={() => {
            clearPressTimer();
            if (dismissTimer.current) clearTimeout(dismissTimer.current);
            dismissTimer.current = null;
            longPress.current = false;
            wiring.hide();
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            clearPressTimer();
            if (longPress.current) wiring.hide();
            longPress.current = false;
          }}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onContextMenu={(event) => { if (longPress.current) event.preventDefault(); }}
          {...wiring.anchorProps}
        >
          <span className="min-w-0 flex-1 truncate">{label}</span>
        </Button>
        <Button type="button" data-variant="text" disabled={disabled} className={classNames?.chipRemove} aria-label={`${texts.removeLabel}: ${label}`} icon={<X />} onClick={onRemove}/>
      </span>
      <TooltipContent id={popoverId} anchorName={anchorName} delay={100}>
        {label}
      </TooltipContent>
    </>
  );
}

const skinRenderChip = (args: FilterChipRenderArgs) => <FilterChip {...args} />;

const skinRenderOption = ({ item, active, id, onSelect, onHover, classNames, styles }: FilterOptionRenderArgs) => (
  <div
    id={id}
    role="option"
    aria-selected={active}
    data-highlighted={active || undefined}
    className={classNames?.option}
    style={styles?.option}
    onMouseDown={(event) => event.preventDefault()}
    onMouseMove={onHover}
    onClick={onSelect}
  >
    <span className={classNames?.optionLabel} style={styles?.optionLabel}>{item.label}</span>
    <span className={classNames?.optionDetail} style={styles?.optionDetail}>{item.detail}</span>
  </div>
);

const filterComboboxDisabledClasses = {
  ...filterComboboxClasses,
  bar: barDisabledClasses,
  chip: chipDisabledClasses,
  draft: draftDisabledClasses,
  input: inputDisabledClasses,
  hint: hintDisabledClasses,
  submit: filterTextButtonDisabledClasses,
  cancel: filterTextButtonDisabledClasses,
  clear: cn(filterTextButtonDisabledClasses, clearLayoutClasses),
  status: "min-h-5 text-sm text-disabled-fg",
  error: "text-disabled-fg",
};

export function FilterCombobox({ className, classNames, renderChip, renderOption, disabled, ...props }: FilterComboboxProps) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  const baseSlots = disabled ? filterComboboxDisabledClasses : filterComboboxClasses;
  return (
    <FilterComboboxHeadless
      {...props}
      disabled={disabled}
      renderChip={renderChip ?? skinRenderChip}
      renderOption={renderOption ?? skinRenderOption}
      classNames={mergeSlots(baseSlots, { ...slots, root: cn(baseSlots.root, rootOverride, className) })}
    />
  );
}
