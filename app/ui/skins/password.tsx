import { Password as PasswordHeadless } from "@/ui";
import type { PasswordProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";
import { fieldGroupClasses, fieldHintClasses, fieldInputClasses } from "./input";

export type { PasswordProps } from "@/ui";


const inputClasses = fieldInputClasses + " appearance-none peer";

const toggleClasses =
  "relative cursor-pointer rounded-sm p-1 " +
  "" +
  "after:content-[''] after:absolute after:inset-[calc(50%-var(--height-control)/2)]";

const toggleIconClasses = "flex-none size-4";


export const passwordShellClasses = cn(fieldGroupClasses, "relative");

export const passwordPartClasses = {
  root: inputClasses,
  toggle: toggleClasses,
  toggleIcon: toggleIconClasses,
  hint: fieldHintClasses,
};

export function Password({ className, classNames, ...props }: PasswordProps) {
  return (
    <PasswordHeadless
      {...props}
      fieldClassNames={fieldChromeClasses}
      className={cn(passwordShellClasses, className)}
      classNames={mergeSlots(passwordPartClasses, classNames)}
    />
  );
}
