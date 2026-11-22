import { InputOtp as InputOtpHeadless } from "@/ui";
import type { InputOtpProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

export type { InputOtpProps } from "@/ui";


const groupClasses = "flex w-full items-center justify-center gap-x-2";

const slotBoxClasses =
  "h-control min-w-0 flex-1 max-w-[var(--width-control)] rounded-md border-hair border-border";
const slotTextClasses =
  "text-foreground text-center text-label leading-label font-strong outline-none shadow-frame motion-frame focus:focus-ring disabled:dim";
const slotInvalidClasses =
  "aria-[invalid=true]:border-danger-fg aria-[invalid=true]:text-danger-fg " +
  "aria-[invalid=true]:focus:border-danger-fg aria-[invalid=true]:focus-visible:focus-ring-danger";

const slotClasses = cn(slotBoxClasses, slotTextClasses, slotInvalidClasses);

export function InputOtp({ className, classNames, ...props }: InputOtpProps) {
  return (
    <InputOtpHeadless
      {...props}
      className={cn(groupClasses, className)}
      classNames={mergeSlots({ slot: slotClasses }, classNames)}
    />
  );
}
