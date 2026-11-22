import { Transfer as TransferHeadless } from "@/ui";
import type { TransferProps } from "@/ui";
import type { ReactNode } from "react";
import { cn, mergeSlots } from "../utils/cn";
import { checkboxPartClasses } from "./checkbox";
import { buttonVariants } from "./button";


const rootClasses = "flex items-center gap-x-3";

const titleClasses = "truncate";

const rowClasses = mergeSlots(checkboxPartClasses, {
  label: cn(
    checkboxPartClasses.label,
    "w-full rounded-sm px-3 py-2 ",
  ),
});

const partClasses = {
  panel: "flex min-w-0 flex-1 flex-col rounded-lg border-frame border-border shadow-surface",
  header:
    "flex items-center justify-between gap-x-3 border-b-frame border-border px-3 py-2 text-sm font-label tracking-label case-label leading-body text-foreground",
  count: "text-xs leading-none font-field text-surface-fg",
  body: "flex h-64 flex-col overflow-auto p-1",
  empty: "m-0 px-3 py-2 text-sm leading-body text-surface-fg",
  actions: "flex flex-col items-center gap-x-2",
  move: cn(
    buttonVariants.outline,
    "text-surface-fg active:crush",
  ),
};

const wrapTitle = (text: ReactNode | undefined, fallback: string): ReactNode =>
  text === undefined || typeof text === "string" ? (
    <span className={titleClasses}>{text ?? fallback}</span>
  ) : (
    text
  );

export function Transfer({ className, classNames, titles, ...props }: TransferProps) {
  return (
    <TransferHeadless
      {...props}
      className={cn(rootClasses, className)}
      titles={[wrapTitle(titles?.[0], "Source"), wrapTitle(titles?.[1], "Target")]}
      classNames={{
        ...mergeSlots(partClasses, classNames),
        item: mergeSlots(rowClasses, classNames?.item),
      }}
    />
  );
}
