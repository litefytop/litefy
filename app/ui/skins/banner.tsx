import { Banner as BannerHeadless } from "@/ui";
import type { BannerProps } from "@/ui";
import { buttonInlineClasses } from "./button";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "w-full min-w-0 flex items-center bg-surface text-surface-fg " +
  "text-base leading-relaxed font-field tracking-label case-label";

const viewportClasses = "flex-1 min-w-0 overflow-hidden";

const trackClasses = "flex w-max items-center";

const itemClasses = "inline-flex shrink-0 items-center gap-x-4 px-12";

const closeClasses = cn(
  buttonInlineClasses,
  "h-control cursor-pointer text-surface-fg px-2 focus-visible:focus-ring",
  "bg-surface absolute end-0 top-1/2 -translate-y-1/2",
);

export function Banner({ className, classNames, closable, ...props }: BannerProps) {
  return (
    <BannerHeadless
      {...props}
      closable={closable}
      className={cn(
        rootClasses,
        closable && "relative min-h-control",
        className,
      )}
      classNames={mergeSlots(
        {
          viewport: viewportClasses,
          track: trackClasses,
          item: itemClasses,
          close: closeClasses,
        },
        classNames,
      )}
    />
  );
}
