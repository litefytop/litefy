import { Transfer as TransferHeadless } from "@/ui";
import type { TransferProps } from "@/ui";
import type { ReactNode } from "react";
import { cn, mergeSlots, mergeStateSlots, type SlotState } from "../utils/cn";
import { checkboxClasses } from "./checkbox";
import { buttonVariants } from "./button";


const transferSizeClasses = {
  sm: "max-w-[20rem]",
  md: "max-w-[24rem]",
  lg: "max-w-[28rem]",
  xl: "max-w-[32rem]",
  "2xl": "max-w-[40rem]",
};

const rootClasses = "flex w-full min-w-0 items-center gap-x-3";

const titleClasses = "truncate";

const moveClasses = cn(buttonVariants.outline, "pure-icon");
const moveDisabledClasses = cn(buttonVariants.disabled, "pure-icon");

const partClasses = {
  panel: "flex min-w-0 flex-1 flex-col rounded-lg border-frame border-border shadow-surface",
  header:
    "flex items-center justify-between gap-x-3 border-b-frame border-border px-3 py-2 text-sm control-label leading-body text-foreground",
  count: "text-xs leading-none font-field text-foreground",
  body: "flex h-64 flex-col overflow-auto p-1",
  empty: "m-0 px-3 py-2 text-sm leading-body text-foreground",
  actions: "flex flex-col items-center gap-x-2",
  move: ({ disabled }: SlotState) => disabled ? moveDisabledClasses : moveClasses,
};

const wrapTitle = (text: ReactNode | undefined, fallback: string): ReactNode =>
  text === undefined || typeof text === "string" ? (
    <span className={titleClasses}>{text ?? fallback}</span>
  ) : (
    text
  );

export function Transfer({ size = "2xl", className, classNames, titles, ...props }: TransferProps) {
  const { item, ...field } = classNames ?? {};
  return (
    <TransferHeadless
      {...props}
      size={size}
      className={cn(rootClasses, transferSizeClasses[size], className)}
      titles={[wrapTitle(titles?.[0], "Source"), wrapTitle(titles?.[1], "Target")]}
      classNames={{
        ...mergeStateSlots(partClasses, field),
        item: ({ disabled }: SlotState) => mergeSlots(
          checkboxClasses(disabled, { label: "w-full rounded-sm px-3 py-2" }),
          typeof item === "function" ? item({ disabled }) : item,
        ),
      }}
    />
  );
}
