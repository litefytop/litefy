import { SwipeActions as SwipeActionsHeadless } from "@/ui";
import type { SwipeActionsProps } from "@/ui";
import { mergeSlots } from "../utils/cn";

const rootClasses =
  "group/swipe relative overflow-clip [height:var(--swipe-h)] " +
  "[transition-property:height,margin-bottom,opacity] duration-(--swipe-collapse) ease-frame motion-reduce:transition-none " +
  "data-[phase=collapsing]:h-0! data-[phase=collapsing]:mb-0! data-[phase=collapsing]:opacity-0 " +
  "data-[phase=entering]:h-0! data-[phase=entering]:mb-0! data-[phase=entering]:opacity-0 " +
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const rowClasses =
  "relative h-full overflow-hidden rounded-swipe border-hair bg-background text-foreground shadow-frame";

const railClasses =
  "absolute inset-0 bg-surface";

const actionClasses =
  "group/action absolute top-0 grid h-full w-(--swipe-a) cursor-pointer touch-manipulation place-items-center border-0 p-0 select-none motion-frame focus-visible:focus-ring " +
  "data-[tone=primary]:bg-primary data-[tone=primary]:text-primary-fg data-[tone=primary]:hover:bg-primary-accent " +
  "data-[tone=info]:bg-info data-[tone=info]:text-info-fg data-[tone=info]:hover:bg-info-accent " +
  "data-[tone=success]:bg-success data-[tone=success]:text-success-fg data-[tone=success]:hover:bg-success-accent " +
  "data-[tone=warning]:bg-warning data-[tone=warning]:text-warning-fg data-[tone=warning]:hover:bg-warning-accent " +
  "[&>span]:flex [&>span]:flex-col [&>span]:items-center [&>span]:gap-y-1 [&>span]:text-sm [&>span]:leading-5 [&>span]:font-field " +
  "[&>span]:transition-transform [&>span]:duration-(--transition-duration-frame) [&>span]:ease-frame group-active/action:[&>span]:scale-[0.97] motion-reduce:group-active/action:[&>span]:scale-100";

const commitClasses =
  "group/action grid h-full w-(--swipe-a) cursor-pointer touch-manipulation place-items-center border-0 bg-transparent p-0 select-none text-danger-fg " +
  "hover:bg-danger-accent focus-visible:focus-ring " +
  "data-[direction=left]/swipe:left-0 data-[direction=right]/swipe:right-0 " +
  "[&>span]:flex [&>span]:flex-col [&>span]:items-center [&>span]:gap-y-1 [&>span]:text-sm [&>span]:leading-5 [&>span]:font-field " +
  "[&>span]:transition-transform [&>span]:duration-(--transition-duration-frame) [&>span]:ease-frame group-active/action:[&>span]:scale-[0.97] motion-reduce:group-active/action:[&>span]:scale-100";

const blockClasses =
  "absolute top-0 h-full w-full bg-danger text-danger-fg " +
  "group-data-[direction=left]/swipe:left-[calc(100%-var(--swipe-a))] group-data-[direction=right]/swipe:right-[calc(100%-var(--swipe-a))]";

const surfaceClasses =
  "relative z-10 flex h-full touch-pan-y items-center gap-x-3 px-4 bg-background text-foreground " +
  "group-data-[dragging]/swipe:**:select-none " +
  "group-data-[dragging]/swipe:select-none";

const hintClasses =
  "flex size-4 shrink-0 items-center text-surface-fg [&_svg]:size-full " +
  "motion-safe:animate-swipe-hint [--hint-nudge-x:-4px] group-data-[direction=right]/swipe:[--hint-nudge-x:4px] " +
  "group-data-[direction=right]/swipe:order-first " +
  "group-data-[open]/swipe:hidden group-data-[dragging]/swipe:hidden group-data-[disabled]/swipe:hidden";

const toggleClasses =
  "absolute top-1/2 m-0 h-px w-px overflow-hidden border-0 bg-transparent p-0 text-foreground -translate-y-1/2 whitespace-nowrap " +
  "[clip-path:inset(50%)] " +
  "focus-visible:h-[1.5rem] focus-visible:w-auto focus-visible:overflow-visible focus-visible:rounded-pill focus-visible:px-2.5 focus-visible:text-xs focus-visible:[clip-path:none] focus-visible:bg-accent focus-visible:text-accent-fg focus-visible:focus-ring";

const liveClasses = "sr-only";

export function SwipeActions({ className, classNames, ...props }: SwipeActionsProps) {
  return (
    <SwipeActionsHeadless
      {...props}
      className={className}
      classNames={mergeSlots(
        {
          root: rootClasses,
          row: rowClasses,
          rail: railClasses,
          action: actionClasses,
          block: blockClasses,
          commit: commitClasses,
          surface: surfaceClasses,
          hint: hintClasses,
          toggle: toggleClasses,
          live: liveClasses,
        },
        classNames
      )}
    />
  );
}

export { SwipeActionsHeadless as SwipeActionsBase };
