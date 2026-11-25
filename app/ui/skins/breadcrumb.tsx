import { Breadcrumb as BreadcrumbHeadless } from "@/ui";
import type { BreadcrumbProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "text-sm leading-relaxed control-label";

const listClasses = "m-0 flex list-none flex-wrap items-center gap-x-4 p-0";

const itemClasses = "inline-flex items-center gap-x-4";

const linkClasses =
  "px-2 text-foreground no-underline motion-frame " +
  "hover:underline underline-offset-4 active:crush";

const pageClasses = "font-strong text-foreground";

const separatorClasses = "inline-flex items-center text-foreground";

const separatorIconClasses = "size-3.5";

const partClasses = {
  list: listClasses,
  item: itemClasses,
  link: linkClasses,
  page: pageClasses,
  separator: separatorClasses,
  separatorIcon: separatorIconClasses,
};

export function Breadcrumb({ className, classNames, ...props }: BreadcrumbProps) {
  return (
    <BreadcrumbHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(partClasses, classNames)}
    />
  );
}
