import { Button as ButtonHeadless } from "@/ui";
import type { ButtonProps } from "@/ui";
import { cn } from "../utils/cn";


const frame =
  "inline-flex cursor-pointer h-control items-center justify-center gap-x-2 whitespace-nowrap text-center no-underline [&_svg]:size-5 sm:[&_svg]:size-4 " +
  "rounded-pill px-[calc(var(--spacing)*3+min(var(--radius-pill),var(--height-control)/2))] " +
  "data-[status-reserve]:px-[calc(var(--spacing)*3+min(var(--radius-pill),var(--height-control)/2)+var(--spacing)*3.5)] sm:data-[status-reserve]:px-[calc(var(--spacing)*3+min(var(--radius-pill),var(--height-control)/2)+var(--spacing)*3)] " +
  "text-label leading-label tracking-label font-label case-label " +
  "motion-frame disabled:border-dashed " +
  "data-[pure-icon=true]:aspect-square " +
  "data-[pure-icon=true]:px-0 " +
  "data-[pure-icon=true]:after:absolute data-[pure-icon=true]:after:-inset-hit data-[pure-icon=true]:after:content-['']";


const blockMotion =
  " hover:lift hover:shadow-frame-hover active:crush active:shadow-frame-active disabled:shadow-frame-disabled";

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
  const pureIcon = children === null || children === undefined;
  return (
    <ButtonHeadless
      {...props}
      icon={icon}
      status={status}
      className={cn(
        buttonVariants[pickVariant(props)],
        pureIcon && "relative",
        className,
      )}
    >
      {children}
    </ButtonHeadless>
  );
}
