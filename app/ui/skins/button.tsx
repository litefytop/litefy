import { Button as ButtonHeadless } from "@/ui";
import type { ButtonProps } from "@/ui";
import { cn } from "../utils/cn";


export const buttonLayoutClasses = "inline-flex items-center justify-center";

const buttonInlineFaceClasses = "[&_svg]:size-4 control-text motion-frame";
const buttonTextLayoutClasses = "h-control gap-x-2 text-nowrap";

export const buttonInlineClasses = cn(
  buttonLayoutClasses,
  "rounded-pill",
  buttonInlineFaceClasses,
);

const blockMotion = "press-frame";

export const buttonTextFieldClasses = cn(
  buttonInlineClasses,
  buttonTextLayoutClasses,
);

export const buttonTextFaceClasses =
  "cursor-pointer text-foreground px-2 " +
  "hover:underline underline-offset-4 focus-visible:focus-ring";

export const buttonDisabledTextFaceClasses =
  "text-disabled-fg px-2 cursor-not-allowed";

const frame = cn(buttonTextFieldClasses, "px-pill-x");
const outlineFaceClasses =
  "cursor-pointer border-hair bg-surface-raised text-surface-raised-fg shadow-frame " +
  blockMotion + " hover:bg-accent hover:text-accent-fg focus-visible:focus-ring";

export const buttonSquareFieldClasses = cn(
  buttonLayoutClasses,
  buttonInlineFaceClasses,
  "rounded-md",
  buttonTextLayoutClasses,
  outlineFaceClasses,
);


export const buttonVariants = {
  primary: cn(
    frame,
    "cursor-pointer border-control bg-primary text-primary-fg shadow-frame",
    blockMotion,
    "hover:bg-primary-accent focus-visible:focus-ring",
  ),
  outline: cn(frame, outlineFaceClasses),
  text: cn(frame, buttonTextFaceClasses),
  danger: cn(
    frame,
    "cursor-pointer border-hair bg-danger text-danger-fg shadow-frame",
    blockMotion,
    "hover:bg-danger-accent focus-visible:focus-ring-danger",
  ),
  disabled: cn(
    frame,
    "border-control bg-disabled text-disabled-fg shadow-frame-disabled cursor-not-allowed",
  ),
  disabledText: cn(frame, buttonDisabledTextFaceClasses),
};

export type ButtonVariant = keyof typeof buttonVariants;

function pickVariant(props: Record<string, unknown>): ButtonVariant {
  if (props["disabled"] === true || props["aria-disabled"] === true || props["aria-disabled"] === "true") {
    return props["data-variant"] === "text" ? "disabledText" : "disabled";
  }
  if (props["data-danger"]) return "danger";
  const variant = props["data-variant"];
  return typeof variant === "string" && variant in buttonVariants
    ? (variant as ButtonVariant)
    : "primary";
}

export function Button({ className, icon, status, children, ...props }: ButtonProps) {
  return (
    <ButtonHeadless
      {...props}
      icon={icon}
      status={status}
      className={cn(buttonVariants[pickVariant(props)], children === null || children === undefined ? "pure-icon" : undefined, className)}
    >
      {children}
    </ButtonHeadless>
  );
}
