import * as React from "react";
import { cn } from "../utils/cn";

type ContentSize = "sm" | "md" | "lg" | "xl";

const contentSizeClasses: Record<ContentSize, string> = {
  sm: "max-w-[20rem]",
  md: "max-w-[24rem]",
  lg: "max-w-[28rem]",
  xl: "max-w-[32rem]",
};

export interface CardProps extends Omit<React.ComponentProps<"div">, "className"> {
  size?: ContentSize;
  className?: string;
  classNames?: {
    inner?: string;
  };
}

export interface CardButtonProps extends Omit<React.ComponentProps<"button">, "className"> {
  size?: ContentSize;
  className?: string;
}

export const cardClasses =
  "block w-full min-w-0 rounded-lg bg-surface-raised text-surface-raised-fg border-frame border-border shadow-block";

export const cardInnerClasses =
  "flex flex-col gap-4 p-4";

const cardButtonBaseClasses = "w-full cursor-pointer text-left p-4 [font:inherit] motion-frame";
const cardButtonStateClasses =
  "hover:lift hover:shadow-block-hover focus-visible:focus-ring active:crush active:shadow-frame-active";
const cardButtonPlainClasses =
  "plain:bg-transparent plain:border-transparent plain:shadow-none plain:hover:border-border";

export const cardButtonClasses = cn(cardButtonBaseClasses, cardButtonStateClasses, cardButtonPlainClasses);

export function Card({ size = "md", className, classNames, children, ...props }: CardProps) {
  return (
    <div {...props} className={cn(cardClasses, contentSizeClasses[size], className)}>
      <div className={classNames?.inner ?? cardInnerClasses}>{children}</div>
    </div>
  );
}

export function CardButton({ type = "button", size = "md", className, ...props }: CardButtonProps) {
  return <button {...props} type={type} className={cn(cardClasses, contentSizeClasses[size], cardButtonClasses, className)} />;
}
