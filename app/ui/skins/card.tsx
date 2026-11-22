import * as React from "react";
import { cn } from "../utils/cn";

export interface CardProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: string;
  classNames?: {
    inner?: string;
  };
}

export interface CardButtonProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: string;
}

export const cardClasses =
  "block w-full rounded-lg border-frame border-border shadow-block";

export const cardInnerClasses =
  "flex flex-col gap-4 p-4";

const cardButtonBaseClasses = "w-full cursor-pointer text-left p-4 [font:inherit] motion-frame";
const cardButtonStateClasses =
  "hover:lift hover:shadow-block-hover focus-visible:focus-ring active:crush active:shadow-frame-active";
const cardButtonPlainClasses =
  "plain:border-transparent plain:shadow-none plain:hover:border-border";

export const cardButtonClasses = cn(cardButtonBaseClasses, cardButtonStateClasses, cardButtonPlainClasses);

export function Card({ className, classNames, children, ...props }: CardProps) {
  return (
    <div {...props} className={cn(cardClasses, className)}>
      <div className={classNames?.inner ?? cardInnerClasses}>{children}</div>
    </div>
  );
}

export function CardButton({ type = "button", className, ...props }: CardButtonProps) {
  return <button {...props} type={type} className={cn(cardClasses, cardButtonClasses, className)} />;
}
