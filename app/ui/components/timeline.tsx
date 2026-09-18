"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface TimelineRootProps extends Omit<React.ComponentProps<"ol">, "className"> {
  className?: ClassNameValue;
}

export function TimelineRoot({ className, ...props }: TimelineRootProps) {
  return <ol {...props} className={cn("flex w-full flex-col", className)} />;
}

export interface TimelineItemProps extends Omit<React.ComponentProps<"li">, "className"> {
  connector?: boolean;
  marker?: React.ReactNode;
  time?: React.ReactNode;
  heading: React.ReactNode;
  description?: React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    marker?: ClassNameValue;
    connector?: ClassNameValue;
    time?: ClassNameValue;
    heading?: ClassNameValue;
    description?: ClassNameValue;
  };
  styles?: {
    marker?: React.CSSProperties;
    connector?: React.CSSProperties;
    time?: React.CSSProperties;
    heading?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

export function TimelineItem({
  connector = true,
  marker,
  time,
  heading,
  description,
  className,
  classNames,
  styles,
  ...props
}: TimelineItemProps) {
  return (
    <li {...props} className={cn("flex gap-3 pb-6 last:pb-0", className)}>
      <span className="flex shrink-0 flex-col items-center">
        <span
          className={cn(
            "z-10 flex size-3 shrink-0 items-center justify-center rounded-full bg-primary text-background",
            "has-[svg]:size-5 has-[svg]:border has-[svg]:bg-background has-[svg]:text-foreground",
            classNames?.marker,
          )}
          style={styles?.marker}
        >
          {marker}
        </span>
        {connector && (
          <span
            aria-hidden
            className={cn("w-px flex-1 bg-border", classNames?.connector)}
            style={styles?.connector}
          />
        )}
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        {time && (
          <span
            className={cn("text-xs tabular-nums text-muted-foreground", classNames?.time)}
            style={styles?.time}
          >
            {time}
          </span>
        )}
        <span className={cn("text-sm font-medium", classNames?.heading)} style={styles?.heading}>
          {heading}
        </span>
        {description && (
          <span
            className={cn("text-sm text-muted-foreground", classNames?.description)}
            style={styles?.description}
          >
            {description}
          </span>
        )}
      </div>
    </li>
  );
}

export interface TimelineItemConfig {
  marker?: React.ReactNode;
  time?: React.ReactNode;
  heading: React.ReactNode;
  description?: React.ReactNode;
}

export interface TimelineProps
  extends Omit<React.ComponentProps<"ol">, "className"> {
  items: TimelineItemConfig[];
  className?: ClassNameValue;
  classNames?: {
    marker?: ClassNameValue;
    connector?: ClassNameValue;
    time?: ClassNameValue;
    heading?: ClassNameValue;
    description?: ClassNameValue;
  };
  styles?: {
    marker?: React.CSSProperties;
    connector?: React.CSSProperties;
    time?: React.CSSProperties;
    heading?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

export function Timeline({ items, className, classNames, styles, ...props }: TimelineProps) {
  return (
    <TimelineRoot {...props} className={className}>
      {items.map((item, i) => (
        <TimelineItem
          key={i}
          connector={i < items.length - 1}
          marker={item.marker}
          time={item.time}
          heading={item.heading}
          description={item.description}
          classNames={classNames}
          styles={styles}
        />
      ))}
    </TimelineRoot>
  );
}
