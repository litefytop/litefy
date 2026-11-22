import { Button, ButtonRoot, FilterCombobox as FilterComboboxHeadless } from "@/ui";
import type {
  FilterChipRenderArgs,
  FilterComboboxProps,
  FilterOptionRenderArgs,
} from "@/ui";
import { X } from "@/ui/components/icons";
import { buttonVariants } from "./button";
import { cn, mergeSlots } from "../utils/cn";
import { fieldGroupClasses } from "./input";

const filterHintBaseClasses =
  "pointer-events-none absolute -top-7 right-0 z-10 flex items-center gap-x-2 whitespace-nowrap";
const filterHintFaceClasses =
  "rounded-sm border-frame border-border bg-surface-raised px-2 py-1 text-xs leading-4 tracking-label case-label shadow-subtle";

export const filterComboboxClasses = {
  root: "flex w-full flex-col gap-y-1 @container",
  bar: cn(fieldGroupClasses, "relative flex min-h-field w-full flex-wrap items-center gap-x-1 gap-y-1 px-2 py-1 text-sm focus-within:focus-ring data-clear:pr-14"),
  chip: "inline-flex h-7 max-w-full shrink-0 items-center rounded-md border-hair border-border bg-surface-raised px-1 text-sm text-foreground",
  chipLabel: "inline-flex h-full items-center whitespace-nowrap bg-transparent px-0 text-sm text-surface-fg focus-visible:focus-ring",
  chipRemove: cn(buttonVariants.text, "h-7 min-h-0 w-7 min-w-0"),
  draft: "inline-flex h-7 max-w-full shrink-0 items-center gap-x-0.5 whitespace-nowrap rounded-md border-hair border-dashed border-border bg-surface-raised px-1 text-sm text-surface-fg",
  input: "min-w-16 flex-[1_1_--spacing(32)] border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-surface-fg",
  list: "max-h-72 min-w-64 overflow-y-auto rounded-md border-frame border-border bg-surface-raised shadow-elevated p-[var(--radius-md)]",
  option: "flex h-control cursor-pointer select-none items-center gap-x-2 px-3 text-sm text-foreground data-highlighted:bg-surface data-[disabled]:dim",
  optionLabel: "min-w-0 flex-1 truncate",
  optionDetail: "shrink-0 text-xs text-surface-fg",
  submit: cn(buttonVariants.text, "h-7 min-h-0 w-7 min-w-0 shrink-0"),
  cancel: cn(buttonVariants.text, "h-7 min-h-0 w-7 min-w-0 shrink-0"),
  clear: cn(buttonVariants.text, "absolute right-1 top-1/2 h-control min-h-0 w-control min-w-0 -translate-y-1/2"),
  hint: cn(filterHintBaseClasses, filterHintFaceClasses),
  hintKeys: "inline-flex items-center gap-x-1",
  hintKey: "kbd",
  status: "min-h-5 text-sm text-surface-fg",
  error: "text-danger-fg",
};

const skinRenderChip = ({ label, texts, onEdit, onRemove, classNames }: FilterChipRenderArgs) => (
  <span className={classNames?.chip} data-slot="chip">
    <ButtonRoot type="button" className={classNames?.chipLabel} aria-label={`${texts.editLabel}: ${label}`} onClick={onEdit}>
      {label}
    </ButtonRoot>
    <Button type="button" className={classNames?.chipRemove} aria-label={`${texts.removeLabel}: ${label}`} icon={<X />} onClick={onRemove}/>
  </span>
);

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

export function FilterCombobox({ classNames, renderChip, renderOption, ...props }: FilterComboboxProps) {
  return (
    <FilterComboboxHeadless
      {...props}
      renderChip={renderChip ?? skinRenderChip}
      renderOption={renderOption ?? skinRenderOption}
      classNames={mergeSlots(filterComboboxClasses, classNames)}
    />
  );
}
