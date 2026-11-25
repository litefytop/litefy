import { Details as DetailsHeadless } from "@/ui";
import type { DetailsProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { collapseRootClasses } from "./collapse";

const summaryBaseClasses =
  "flex min-h-control list-none items-center justify-between gap-x-2 px-3 py-3 text-left";
const summaryTextClasses =
  "text-sm font-label leading-label tracking-label case-label [&::-webkit-details-marker]:hidden";
const summaryHoverClasses =
  "cursor-pointer group-not-open:hover:bg-accent group-not-open:hover:text-accent-fg focus-visible:focus-ring";

const summaryClasses = cn(summaryBaseClasses, summaryTextClasses, summaryHoverClasses);

const iconClasses =
  "size-4 flex-none transition-transform ease-frame duration-md group-open:-rotate-180";

const bodyClasses =
  "border-t-hair border-border p-4 text-sm leading-body font-medium";

const partClasses = { summary: summaryClasses, icon: iconClasses, body: bodyClasses };

const disabledPartClasses = {
  summary: cn(summaryBaseClasses, summaryTextClasses, "cursor-not-allowed text-disabled-fg focus-visible:focus-ring"),
  icon: iconClasses,
  body: cn(bodyClasses, "text-disabled-fg"),
};

export function Details({ className, classNames, disabled, ...props }: DetailsProps) {
  return (
    <DetailsHeadless
      {...props}
      disabled={disabled}
      className={cn(collapseRootClasses, className)}
      classNames={mergeSlots(disabled ? disabledPartClasses : partClasses, classNames)}
    />
  );
}
