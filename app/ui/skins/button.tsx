import { Button as ButtonHeadless } from "@/ui";
import type { ButtonProps } from "@/ui";
import { cn } from "../utils/cn";


const frameLayoutClasses =
  "inline-flex cursor-pointer h-control items-center justify-center gap-x-2 whitespace-nowrap text-center no-underline";
const frameIconClasses = "[&_svg]:size-5 sm:[&_svg]:size-4";
const framePillClasses =
  "rounded-pill px-[max(var(--spacing)*3,min(var(--radius-pill),var(--height-control)/2))]";
const frameTextClasses = "text-label leading-label tracking-label font-label case-label";
const frameStateClasses =
  "motion-frame disabled:border-dashed data-[pure-icon=true]:aspect-square data-[pure-icon=true]:p-0";

const frame = cn(frameLayoutClasses, frameIconClasses, framePillClasses, frameTextClasses, frameStateClasses);


const blockMotion =
  "hover:lift hover:shadow-frame-hover active:crush active:shadow-frame-active disabled:dim disabled:shadow-frame-disabled";

export const buttonVariants = {
  primary: cn(
    frame,
    "border-control border-border bg-primary text-primary-fg shadow-frame",
    blockMotion,
    "hover:bg-primary-accent hover:text-primary-fg focus-visible:focus-ring",
  ),
  outline: cn(
    frame,
    "border-hair border-border bg-background text-foreground shadow-frame",
    blockMotion,
    "hover:bg-accent hover:text-accent-fg focus-visible:focus-ring",
  ),
  text: cn(
    frame,
    "border-transparent bg-transparent text-foreground shadow-none px-2",
    "hover:underline underline-offset-4 focus-visible:focus-ring",
  ),
  danger: cn(
    frame,
    "border-hair border-border bg-danger text-danger-fg shadow-frame",
    blockMotion,
    "hover:bg-danger-accent focus-visible:focus-ring-danger",
  ),
};

export type ButtonVariant = keyof typeof buttonVariants;

function pickVariant(props: Record<string, unknown>): ButtonVariant {
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
      className={cn(buttonVariants[pickVariant(props)], className)}
    >
      {children}
    </ButtonHeadless>
  );
}
