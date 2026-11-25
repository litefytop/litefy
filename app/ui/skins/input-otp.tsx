import { InputOtp as InputOtpHeadless } from "@/ui";
import type { InputOtpProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

export type { InputOtpProps } from "@/ui";


const groupClasses = "flex w-full min-w-0 max-w-[20rem] items-center justify-center gap-x-2";

const slotBoxClasses =
  "h-control min-w-0 flex-1 max-w-[var(--width-control)] rounded-md border-hair border-border";
const slotTextClasses =
  "text-foreground text-center text-label leading-label font-strong outline-none shadow-frame motion-frame focus:focus-ring";
const slotInvalidClasses =
  "field-invalid aria-[invalid=true]:text-danger-independent";

const slotClasses = cn(slotBoxClasses, slotTextClasses, slotInvalidClasses);
const slotDisabledClasses = cn(
  slotBoxClasses,
  "cursor-not-allowed border-border bg-disabled text-center text-label leading-label font-strong text-disabled-fg shadow-frame",
);

export function InputOtp({ className, classNames, disabled, ...props }: InputOtpProps) {
  return (
    <InputOtpHeadless
      {...props}
      disabled={disabled}
      className={cn(groupClasses, className)}
      classNames={mergeSlots({ slot: disabled ? slotDisabledClasses : slotClasses }, classNames)}
    />
  );
}
