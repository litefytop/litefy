import { Password as PasswordHeadless } from "@/ui";
import type { PasswordProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";
import { fieldGroupClasses, fieldGroupDisabledClasses, fieldInputClasses, fieldInputDisabledClasses } from "./input";

export type { PasswordProps } from "@/ui";


const inputClasses = fieldInputClasses + " appearance-none peer";
const inputDisabledClasses = fieldInputDisabledClasses + " appearance-none peer";

const toggleLayoutClasses =
  "inline-flex size-11 -my-px shrink-0 items-center justify-center rounded-sm px-3";

const toggleClasses = cn(toggleLayoutClasses, "cursor-pointer");
const toggleDisabledClasses = cn(toggleLayoutClasses, "cursor-not-allowed text-disabled-fg");

const toggleIconClasses = "flex-none size-4";


export const passwordShellClasses = cn(fieldGroupClasses, "relative");
export const passwordShellDisabledClasses = cn(fieldGroupDisabledClasses, "relative");

const passwordShellClassesByState = (disabled: boolean | undefined) =>
  disabled ? passwordShellDisabledClasses : passwordShellClasses;

const hintShellClasses =
  "pointer-events-none absolute -top-7 right-0 z-10 hidden pointer-fine:min-sm:flex opacity-0 peer-focus-visible:opacity-100";

export const passwordPartClasses = {
  root: inputClasses,
  toggle: toggleClasses,
  toggleIcon: toggleIconClasses,
  hint: hintShellClasses,
  hintKey: "kbd",
};

export function Password({ className, classNames, disabled, ...props }: PasswordProps) {
  return (
    <PasswordHeadless
      {...props}
      disabled={disabled}
      fieldClassNames={fieldChromeClasses}
      className={cn(passwordShellClassesByState(disabled), className)}
      classNames={mergeSlots(
        {
          ...passwordPartClasses,
          root: disabled ? inputDisabledClasses : inputClasses,
          toggle: disabled ? toggleDisabledClasses : toggleClasses,
        },
        classNames,
      )}
    />
  );
}
