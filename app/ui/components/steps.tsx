"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { type ClassNameValue, cn } from "..";

export interface StepsRootProps extends Omit<React.ComponentProps<"ol">, "className"> {
  className?: ClassNameValue;
  orientation?: "horizontal" | "vertical";
}

export function StepsRoot({ className, orientation = "horizontal", ...props }: StepsRootProps) {
  return (
    <ol
      {...props}
      data-orientation={orientation}
      className={cn(
        "flex w-full items-start",
        orientation === "vertical" && "flex-col items-stretch",
        className,
      )}
    />
  );
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
  
  children?: React.ReactNode;
  clickable?: boolean;
  orientation?: "horizontal" | "vertical";
  
  connector?: boolean;
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
  children,
  clickable,
  orientation = "horizontal",
  connector,
  onSelect,
  className,
  classNames,
  ...props
}: StepsItemProps) {
  const vertical = orientation === "vertical";

  const marker = (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => onSelect?.(index)}
      className={cn(
        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
        state === "completed" && "border-primary bg-primary text-primary-foreground",
        state === "current" && "border-primary bg-background text-primary",
        state === "upcoming" && "border-border bg-background text-muted-foreground",
        clickable && "cursor-pointer hover:border-primary",
        classNames?.marker,
      )}
    >
      {state === "completed" ? <Check className="size-3.5" /> : index + 1}
    </button>
  );

  if (vertical) {
    return (
      <li
        aria-current={state === "current" ? "step" : undefined}
        {...props}
        className={cn("relative flex flex-1 gap-3", className)}
      >
        <span className="flex shrink-0 flex-col items-center">
          {marker}
          {connector && (
            <span
              aria-hidden
              className={cn("w-px flex-1", state === "upcoming" ? "bg-border" : "bg-primary", classNames?.connector)}
            />
          )}
        </span>
        <span className={cn("flex min-w-0 flex-col gap-0.5 pt-0.5", connector && "pb-4")}>
          {clickable ? (
            <button
              type="button"
              onClick={() => onSelect?.(index)}
              className={cn(
                "cursor-pointer text-start text-sm font-medium leading-none",
                state === "upcoming" && "text-muted-foreground",
                classNames?.title,
              )}
            >
              {title}
            </button>
          ) : (
            <span
              className={cn(
                "text-sm font-medium leading-none",
                state === "upcoming" && "text-muted-foreground",
                classNames?.title,
              )}
            >
              {title}
            </span>
          )}
          {description && (
            <span className={cn("text-xs text-muted-foreground", classNames?.description)}>
              {description}
            </span>
          )}
          {children && <div className="pt-3">{children}</div>}
        </span>
      </li>
    );
  }

  return (
    <li
      aria-current={state === "current" ? "step" : undefined}
      {...props}
      className={cn("relative flex flex-1 flex-col items-center gap-1.5", className)}
    >
      {connector && (
        <span
          aria-hidden
          className={cn(
            "absolute top-3 left-[calc(-50%+0.75rem)] right-[calc(50%+0.75rem)] h-px",
            state === "upcoming" ? "bg-border" : "bg-primary",
            classNames?.connector,
          )}
        />
      )}
      {marker}
      <span className="flex flex-col items-center gap-1">
        {clickable ? (
          <button
            type="button"
            onClick={() => onSelect?.(index)}
            className={cn(
              "cursor-pointer text-center text-xs font-medium leading-none",
              state === "upcoming" && "text-muted-foreground",
              classNames?.title,
            )}
          >
            {title}
          </button>
        ) : (
          <span
            className={cn(
              "text-center text-xs font-medium leading-none",
              state === "upcoming" && "text-muted-foreground",
              classNames?.title,
            )}
          >
            {title}
          </span>
        )}
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
        {children && <div className="w-full pt-2 text-start">{children}</div>}
      </span>
    </li>
  );
}

export interface StepsItemConfig {
  title: React.ReactNode;
  description?: React.ReactNode;
  
  content?: React.ReactNode;
}

export interface StepsProps {
  items: StepsItemConfig[];
  index: number;
  orientation?: "horizontal" | "vertical";
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
  orientation = "horizontal",
  onChange,
  maxIndex = items.length - 1,
  className,
  classNames,
}: StepsProps) {
  return (
    <StepsRoot orientation={orientation} className={className}>
      {items.map((item, i) => (
        <StepsItem
          key={i}
          index={i}
          state={i < index ? "completed" : i === index ? "current" : "upcoming"}
          title={item.title}
          description={item.description}
          clickable={i <= maxIndex && i !== index}
          orientation={orientation}
          connector={orientation === "vertical" ? i < items.length - 1 : i > 0}
          onSelect={onChange}
          classNames={classNames}
        >
          {i === index ? item.content : undefined}
        </StepsItem>
      ))}
    </StepsRoot>
  );
}
