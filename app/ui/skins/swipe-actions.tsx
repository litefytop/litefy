import { SwipeActions as SwipeActionsHeadless } from "@/ui";
import type { SwipeActionsProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses =
  "group/swipe relative w-full min-w-0 overflow-clip [height:var(--swipe-h)] " +
  "transition-[height,margin-bottom,opacity] duration-(--swipe-collapse) ease-frame motion-reduce:transition-none " +
  "data-collapsed:h-0! data-collapsed:mb-0! data-collapsed:opacity-0";

const rowClasses =
  "relative h-full overflow-hidden border-hair bg-surface text-surface-fg shadow-frame";
const rowDisabledClasses =
  "relative h-full overflow-hidden border-hair bg-disabled text-disabled-fg shadow-frame";

const railClasses =
  "absolute inset-0 bg-surface text-surface-fg";

const actionLayoutClasses =
  "group/action absolute top-0 grid h-full w-(--swipe-a) touch-manipulation place-items-center border-0 p-0 select-none motion-frame";

const actionContentClasses =
  "flex flex-col items-center gap-y-1 text-sm leading-5 font-field " +
  "transition-transform duration-(--transition-duration-frame) ease-frame " +
  "group-active/action:scale-[0.97] motion-reduce:group-active/action:scale-100";

const actionBaseClasses = cn(actionLayoutClasses, "cursor-pointer focus-visible:focus-ring");
const actionPrimaryClasses = cn(actionBaseClasses, "bg-primary text-primary-fg hover:bg-primary-accent");
const actionInfoClasses = cn(actionBaseClasses, "bg-info text-info-fg hover:bg-info-accent");
const actionSuccessClasses = cn(actionBaseClasses, "bg-success text-success-fg hover:bg-success-accent");
const actionWarningClasses = cn(actionBaseClasses, "bg-warning text-warning-fg hover:bg-warning-accent");
const actionClassesByTone = {
  primary: actionPrimaryClasses,
  info: actionInfoClasses,
  success: actionSuccessClasses,
  warning: actionWarningClasses,
};

const actionDisabledClasses = cn(
  actionLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);

const commitLayoutClasses =
  "group/action grid h-full w-(--swipe-a) touch-manipulation place-items-center border-0 bg-transparent p-0 select-none " +
  "data-[direction=left]/swipe:left-0 data-[direction=right]/swipe:right-0";

const commitClasses = cn(
  commitLayoutClasses,
  "cursor-pointer text-inherit hover:bg-danger-accent hover:text-danger-fg focus-visible:focus-ring",
);

const commitDisabledClasses = cn(
  commitLayoutClasses,
  "cursor-not-allowed text-disabled-fg",
);

const blockLayoutClasses =
  "absolute top-0 h-full w-full " +
  "group-data-[direction=left]/swipe:left-[calc(100%-var(--swipe-a))] group-data-[direction=right]/swipe:right-[calc(100%-var(--swipe-a))]";
const blockClasses = cn(blockLayoutClasses, "bg-danger text-danger-fg");
const blockDisabledClasses = cn(blockLayoutClasses, "bg-disabled text-disabled-fg");

const surfaceLayoutClasses =
  "relative z-10 flex h-full touch-pan-y items-center gap-x-3 px-4 " +
  "group-data-[dragging]/swipe:**:select-none " +
  "group-data-[dragging]/swipe:select-none";
const surfaceClasses = cn(surfaceLayoutClasses, "bg-surface text-surface-fg");
const surfaceDisabledClasses = cn(surfaceLayoutClasses, "bg-disabled text-disabled-fg");

const hintClasses =
  "flex size-4 shrink-0 items-center text-surface-fg [&_svg]:size-full " +
  "motion-safe:animate-swipe-hint [--hint-nudge-x:-4px] group-data-[direction=right]/swipe:[--hint-nudge-x:4px] " +
  "group-data-[direction=right]/swipe:order-first group-data-[dragging]/swipe:hidden data-hidden:hidden";

const toggleClasses =
  "sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-1/2 focus-visible:h-6 " +
  "focus-visible:-translate-y-1/2 focus-visible:rounded-pill focus-visible:px-2.5 " +
  "focus-visible:text-xs focus-visible:bg-accent focus-visible:text-accent-fg focus-visible:focus-ring text-foreground";
const toggleDisabledClasses = "sr-only cursor-not-allowed text-disabled-fg";

const liveClasses = "sr-only";

const swipeActionSlots = {
  root: rootClasses,
  row: rowClasses,
  rail: railClasses,
  action: actionClassesByTone.primary,
  actionContent: actionContentClasses,
  block: blockClasses,
  commit: commitClasses,
  surface: surfaceClasses,
  hint: hintClasses,
  toggle: toggleClasses,
  live: liveClasses,
};

const swipeActionDisabledSlots = {
  ...swipeActionSlots,
  row: rowDisabledClasses,
  action: actionDisabledClasses,
  block: blockDisabledClasses,
  commit: commitDisabledClasses,
  surface: surfaceDisabledClasses,
  toggle: toggleDisabledClasses,
};

export function SwipeActions({ className, classNames, disabled, ...props }: SwipeActionsProps) {
  const { action, actionContent, root: rootOverride, ...slotOverrides } = classNames ?? {};
  const baseSlots = disabled ? swipeActionDisabledSlots : swipeActionSlots;
  const resolveAction = (tone: keyof typeof actionClassesByTone) =>
    cn(
      disabled ? actionDisabledClasses : actionClassesByTone[tone],
      typeof action === "function" ? action(tone) : action,
    );

  return (
    <SwipeActionsHeadless
      {...props}
      disabled={disabled}
      classNames={{
        ...mergeSlots(baseSlots, { ...slotOverrides, root: cn(rootClasses, rootOverride, className) }),
        action: resolveAction,
        actionContent: cn(actionContentClasses, actionContent),
      }}
    />
  );
}

export { SwipeActionsHeadless as SwipeActionsBase };
