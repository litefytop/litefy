import { FilterCombobox as FilterComboboxHeadless } from "@/ui";
import {
  buttonDisabledTextFaceClasses,
  buttonTextFaceClasses,
  buttonTextFieldClasses,
} from "./button";
import { dialogPartClasses } from "./dialog";
import { listOptionHoverClasses } from "./list";
import type {
  FilterComboboxProps,
  FilterOptionRenderArgs,
} from "@/ui";
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
// 前缀 / 后缀 addon 一律 11 基（44px 触控目标，schemes 第 12 条）：负边距出血盖住 bar 内距，
// 让 44px 盒恰好填满 min-h-field 的字段框高度而不撑高
const prefixClasses =
  "flex size-11 shrink-0 items-center justify-center -my-1 -ml-2";

// 清空钮 = input group 容器的后缀段：size-11 触控目标，负边距出血盖住 bar 内距与右端圆角，与面板同背景色
const clearLayoutClasses =
  "size-11 -my-1 -mr-2 rounded-l-none rounded-r-md bg-surface-raised text-surface-raised-fg";
const clearClasses = cn(
  buttonTextFieldClasses,
  buttonTextFaceClasses,
  "pure-icon",
  clearLayoutClasses,
);
const clearDisabledClasses = cn(
  buttonTextFieldClasses,
  buttonDisabledTextFaceClasses,
  "pure-icon",
  clearLayoutClasses,
  "bg-disabled",
);

const triggerLayoutClasses =
  "flex w-full min-w-0 cursor-pointer items-center gap-x-1 rounded-md border-frame px-2 py-1 text-sm focus-visible:focus-ring";
const triggerClasses = cn(
  fieldGroupBaseClasses,
  triggerLayoutClasses,
  "border-border bg-surface-raised text-surface-raised-fg shadow-frame",
);
const triggerDisabledClasses = cn(
  fieldGroupBaseClasses,
  triggerLayoutClasses,
  "cursor-not-allowed border-border bg-disabled text-disabled-fg shadow-frame",
);

// 面板 = Dialog content，宽度与外观完全沿用 Dialog 内容卡；高度固定（flex 列 + 固定高），
// 提示 / 列表出现与否不再推挤高度；列表区 flex-1 占满剩余空间、超出滚动
const panelClasses = cn(
  dialogPartClasses.content,
  "flex h-[min(24rem,calc(100vh_-_3rem))] flex-col space-y-1",
);

// 输入区与列表区与 cmd 同款：容器不带背景色（透明，融进面板），高亮用 accent
const barLayoutClasses =
  "flex min-h-field min-w-0 flex-wrap items-center gap-1 rounded-md px-2 py-1";
const barDisabledClasses = cn(
  barLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg shadow-frame",
);

// 条件行 = list 里的普通 option 行（骨架渲染），无 chip 外观、无 hover 下划线；行尾移除钮复用 chipRemove 槽
const chipRemoveClasses = filterIconButtonClasses;

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

// 底部提示行与 cmd footer 同款：左固定键帽、右动态提示，border-t 分隔；触屏与窄屏整行隐藏。
// 动态提示可能多条（条件态三组、日期区间两组）——footer 允许换行、右侧组 min-w-0 可收缩换行，横向不溢出；
// 面板固定高 + 列表 flex-1，footer 增高只会压缩列表区，不撑破面板
const footerClasses = cn(
  "flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border pt-1",
  "pointer-coarse:hidden max-sm:hidden",
);
const hintClasses = "flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 text-xs text-foreground";

export const filterComboboxClasses = {
  root: "flex w-full min-w-0 max-w-[20rem] flex-col @container",
  trigger: triggerClasses,
  triggerLabel: "min-w-0 flex-1 truncate text-left",
  panel: panelClasses,
  bar: barLayoutClasses,
  prefix: prefixClasses,
  chipRemove: chipRemoveClasses,
  draft: draftClasses,
  input: inputClasses,
  list: "min-h-0 flex-1 min-w-0 overflow-y-auto p-1",
  option: cn(
    "flex min-h-control cursor-pointer select-none items-center gap-x-2 px-2 py-1.5 text-sm text-foreground",
    listOptionHoverClasses,
  ),
  optionLabel: "min-w-0 flex-1 truncate",
  optionDetail: "shrink-0 text-xs text-inherit",
  submit: filterTextButtonClasses,
  cancel: filterTextButtonClasses,
  clear: clearClasses,
  hint: hintClasses,
  hintKeys: "inline-flex shrink-0 items-center gap-x-1",
  hintKey: "kbd",
  footer: footerClasses,
  status: "min-h-5 px-2 text-sm text-foreground",
  error: "text-danger-independent",
};

// 候选行：与 cmd item 同款 hover/键盘高亮
const skinRenderOption = ({ item, active, id, onSelect, onHover, classNames, styles }: FilterOptionRenderArgs) => (
  <div
    id={id}
    role="option"
    aria-selected={active}
    data-highlighted={active ? "true" : undefined}
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
  trigger: triggerDisabledClasses,
  bar: barDisabledClasses,
  draft: draftDisabledClasses,
  input: inputDisabledClasses,
  submit: filterTextButtonDisabledClasses,
  cancel: filterTextButtonDisabledClasses,
  clear: clearDisabledClasses,
  status: "min-h-5 px-2 text-sm text-disabled-fg",
  error: "text-disabled-fg",
};

export function FilterCombobox({ className, classNames, renderOption, disabled, ...props }: FilterComboboxProps) {
  const { root: rootOverride, panel: panelOverride, ...slots } = classNames ?? {};
  const baseSlots = disabled ? filterComboboxDisabledClasses : filterComboboxClasses;
  return (
    <FilterComboboxHeadless
      {...props}
      disabled={disabled}
      dialogClassNames={{ root: dialogPartClasses.root, stage: dialogPartClasses.stage }}
      renderOption={renderOption ?? skinRenderOption}
      classNames={mergeSlots(baseSlots, {
        ...slots,
        root: cn(baseSlots.root, rootOverride, className),
        panel: cn(panelClasses, panelOverride),
      })}
    />
  );
}
