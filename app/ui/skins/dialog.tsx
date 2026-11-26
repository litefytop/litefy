import type { DialogCommandOptions, DialogProps } from "@/ui";
import { Dialog as DialogHeadless, dialog as dialogHeadless } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonInlineClasses } from "./button";


const rootClasses =
  "h-dvh w-full max-w-none max-h-none m-0 border-0 bg-transparent p-0 overflow-y-auto overscroll-contain [scrollbar-width:none] text-inherit";

const stageClasses =
  "pointer-events-none grid min-h-[calc(100dvh+1px)] w-full place-items-center";

const contentClasses = cn(
  "pointer-events-auto relative w-full my-4 max-w-[min(28rem,calc(100%_-_--spacing(8)))]",
  "rounded-xl border-frame border-border bg-surface-raised p-4 text-surface-raised-fg text-base leading-body shadow-elevated",
);

const headerClasses = "mb-3 flex items-center justify-between gap-x-3";

const titleClasses =
  "m-0 mr-auto min-w-0 truncate text-h3 leading-head font-strong tracking-normal case-label";

const closeClasses = cn(
  buttonInlineClasses,
  "h-control gap-x-2 text-nowrap cursor-pointer text-foreground px-2 hover:no-underline focus-visible:focus-ring",
  "data-[inline=true]:static data-[inline=true]:shrink-0",
);

const closeIconClasses = "size-4";

const closeKeyClasses = "kbd";


const titleIconClasses = cn(
  "inline-flex items-center gap-x-2 [&_svg]:size-4 [&_svg]:shrink-0",
  "data-[status^=s]:text-success-independent " +
  "data-[status^=e]:text-danger-independent " +
  "data-[status^=w]:text-warning-independent " +
  "data-[status^=i]:text-info-independent",
);

const skinClassNames = {
  root: rootClasses,
  stage: stageClasses,
  content: contentClasses,
  header: headerClasses,
  title: titleClasses,
  titleIcon: titleIconClasses,
  close: closeClasses,
  closeIcon: closeIconClasses,
  closeKey: closeKeyClasses,
};


export const dialogPartClasses = skinClassNames;

export function Dialog({ className, classNames, ...props }: DialogProps) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  return <DialogHeadless {...props} className={cn(rootClasses, rootOverride, className)} classNames={mergeSlots(skinClassNames, slots)} />;
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
