import type { DialogCommandOptions, DialogProps } from "@/ui";
import { Dialog as DialogHeadless, dialog as dialogHeadless } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "h-dvh w-full max-w-none max-h-none m-0 border-0 bg-transparent p-0 overflow-y-auto overscroll-contain [scrollbar-width:none] text-inherit @container";

const stageClasses =
  "pointer-events-none grid min-h-[calc(100dvh+1px)] w-full place-items-center";

const contentClasses =
  "pointer-events-auto relative w-full my-4 max-w-[min(100%_-_--spacing(8),--spacing(112))] " +
  "rounded-xl border-frame border-border bg-surface-raised p-4 @xl:p-6 @4xl:p-8 text-foreground text-base leading-body shadow-elevated";

const headerClasses = "mb-3 flex items-center justify-between gap-x-3";

const titleClasses =
  "m-0 mr-auto min-w-0 truncate text-h3 leading-head font-strong tracking-normal case-label";

const closeClasses =
  "absolute right-4 top-4 min-h-control min-w-control cursor-pointer select-none rounded-sm " +
  "border-frame border-border px-0 py-0 text-xs leading-4 font-label tracking-label case-label " +
  "motion-frame active:crush " +
  "data-[inline=true]:static data-[inline=true]:shrink-0";


const titleIconClasses =
  "flex items-center gap-x-3 *:data-status:size-4 " +
  "[&>[data-status=success]]:text-success-fg " +
  "[&>[data-status=error]]:text-danger-fg [&>[data-status=warning]]:text-warning-fg " +
  "[&>[data-status=info]]:text-info-fg";

const skinClassNames = {
  root: rootClasses,
  stage: stageClasses,
  content: contentClasses,
  header: headerClasses,
  title: titleClasses,
  titleIcon: titleIconClasses,
  close: closeClasses,
};


export const dialogPartClasses = skinClassNames;

export function Dialog({ className, classNames, ...props }: DialogProps) {
  return <DialogHeadless {...props} className={cn(rootClasses, className)} classNames={mergeSlots(skinClassNames, classNames)} />;
}

type CommandOptions = Omit<DialogCommandOptions, "type">;

function withSkin(opts: CommandOptions): CommandOptions {
  return {
    ...opts,
    props: { ...opts.props, classNames: mergeSlots(skinClassNames, opts.props?.classNames) },
  };
}

export const dialog = {
  success: (opts: CommandOptions) => dialogHeadless.success(withSkin(opts)),
  error: (opts: CommandOptions) => dialogHeadless.error(withSkin(opts)),
  warning: (opts: CommandOptions) => dialogHeadless.warning(withSkin(opts)),
  info: (opts: CommandOptions) => dialogHeadless.info(withSkin(opts)),
};
