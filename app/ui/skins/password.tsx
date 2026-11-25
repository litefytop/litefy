import { Password as PasswordHeadless } from "@/ui";
import type { PasswordProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";
import { fieldGroupClasses, fieldGroupDisabledClasses, fieldHintClasses, fieldInputClasses, fieldInputDisabledClasses } from "./input";

export type { PasswordProps } from "@/ui";


const inputClasses = fieldInputClasses + " appearance-none peer";
const inputDisabledClasses = fieldInputDisabledClasses + " appearance-none peer";

const toggleLayoutClasses =
  "relative rounded-sm p-1 after:content-[''] thumb-hit";

const toggleClasses = cn(toggleLayoutClasses, "cursor-pointer");
const toggleDisabledClasses = cn(toggleLayoutClasses, "cursor-not-allowed text-disabled-fg");

const toggleIconClasses = "flex-none size-4";


export const passwordShellClasses = cn(fieldGroupClasses, "relative");
export const passwordShellDisabledClasses = cn(fieldGroupDisabledClasses, "relative");

const passwordShellClassesByState = (disabled: boolean | undefined) =>
  disabled ? passwordShellDisabledClasses : passwordShellClasses;

export const passwordPartClasses = {
  root: inputClasses,
  toggle: toggleClasses,
  toggleIcon: toggleIconClasses,
  hint: fieldHintClasses,
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
