"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { type ClassNameValue, cn } from "..";

export interface StepsRootProps extends Omit<React.ComponentProps<"ol">, "className"> {
  className?: ClassNameValue;
}

export function StepsRoot({ className, ...props }: StepsRootProps) {
  return <ol {...props} className={cn("flex w-full items-start", className)} />;
}

export type StepsItemState = "completed" | "current" | "upcoming";

export interface StepsItemProps extends Omit<
  React.ComponentProps<"li">,
  "className" | "title" | "onSelect"
> {
  index: number;
  state: StepsItemState;
  title: React.ReactNode;
  description?: React.ReactNode;
  clickable?: boolean;
  onSelect?: (index: number) => void;
  className?: ClassNameValue;
  classNames?: {
    marker?: ClassNameValue;
    title?: ClassNameValue;
    description?: ClassNameValue;
    connector?: ClassNameValue;
  };
}

export function StepsItem({
  index,
  state,
  title,
  description,
  clickable,
  onSelect,
  className,
  classNames,
  ...props
}: StepsItemProps) {
  return (
    <li
      aria-current={state === "current" ? "step" : undefined}
      {...props}
      className={cn("relative flex min-w-0 flex-1 flex-col items-center gap-1.5", className)}
    >
      {index > 0 && (
        <span
          aria-hidden
          className={cn(
            "absolute top-3 left-[calc(-50%+0.75rem)] right-[calc(50%+0.75rem)] h-px",
            state === "upcoming" ? "bg-border" : "bg-primary",
            classNames?.connector,
          )}
        />
      )}
      <button
        type="button"
        disabled={!clickable}
        onClick={() => onSelect?.(index)}
        className={cn(
          "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
          "disabled:pointer-events-none disabled:cursor-not-allowed",
          state === "completed" && "border-primary bg-primary text-primary-foreground",
          state === "current" && "border-primary bg-background text-primary",
          state === "upcoming" && "border-border bg-background text-muted-foreground",
          clickable && "hover:border-primary",
          classNames?.marker,
        )}
      >
        {state === "completed" ? <Check className="size-3.5" /> : index + 1}
      </button>
      <span
        className={cn(
          "text-center text-xs font-medium leading-none",
          state === "upcoming" && "text-muted-foreground",
          classNames?.title,
        )}
      >
        {title}
      </span>
      {description && (
        <span
          className={cn(
            "text-center text-xs leading-none text-muted-foreground",
            classNames?.description,
          )}
        >
          {description}
        </span>
      )}
    </li>
  );
}

export interface StepsItemConfig {
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepsProps {
  items: StepsItemConfig[];
  index: number;
  onChange?: (nextIndex: number) => void;
  maxIndex?: number;
  className?: ClassNameValue;
  classNames?: {
    marker?: ClassNameValue;
    title?: ClassNameValue;
    description?: ClassNameValue;
    connector?: ClassNameValue;
  };
}

export function Steps({
  items,
  index,
  onChange,
  maxIndex = items.length - 1,
  className,
  classNames,
}: StepsProps) {
  return (
    <StepsRoot className={className}>
      {items.map((item, i) => (
        <StepsItem
          key={i}
          index={i}
          state={i < index ? "completed" : i === index ? "current" : "upcoming"}
          title={item.title}
          description={item.description}
          clickable={i <= maxIndex && i !== index}
          onSelect={onChange}
          classNames={classNames}
        />
      ))}
    </StepsRoot>
  );
}
