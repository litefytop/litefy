"use client";
import * as React from "react";
export type TimelineOrientation = "vertical" | "horizontal";
export interface TimelineRootProps extends Omit<React.ComponentProps<"ol">, "className"> {
    className?: string;
}
export function TimelineRoot({ className, ...props }: TimelineRootProps) {
    return <ol {...props} className={className}/>;
}
export interface TimelineItemProps extends Omit<React.ComponentProps<"li">, "className"> {
    connector?: boolean;
    marker?: React.ReactNode;
    time?: React.ReactNode;
    heading: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    classNames?: {
        item?: string;
        spine?: string;
        marker?: string;
        connector?: string;
        content?: string;
        time?: string;
        heading?: string;
        description?: string;
    };
    styles?: {
        item?: React.CSSProperties;
        spine?: React.CSSProperties;
        marker?: React.CSSProperties;
        connector?: React.CSSProperties;
        content?: React.CSSProperties;
        time?: React.CSSProperties;
        heading?: React.CSSProperties;
        description?: React.CSSProperties;
    };
}
export function TimelineItem({ connector = true, marker, time, heading, description, className, style, classNames, styles, ...props }: TimelineItemProps) {
    return (<li {...props} className={[className, classNames?.item].filter(Boolean).join(" ")} style={{ ...styles?.item, ...style }}>
      <span className={classNames?.spine} style={styles?.spine}>
        <span className={classNames?.marker} style={styles?.marker}>
          {marker}
        </span>
        {connector && (<span aria-hidden className={classNames?.connector} style={styles?.connector}/>)}
      </span>
      <div className={classNames?.content} style={styles?.content}>
        {time && (<span className={classNames?.time} style={styles?.time}>
            {time}
          </span>)}
        <span className={classNames?.heading} style={styles?.heading}>
          {heading}
        </span>
        {description && (<span className={classNames?.description} style={styles?.description}>
            {description}
          </span>)}
      </div>
    </li>);
}
export interface TimelineItemConfig {
    marker?: React.ReactNode;
    time?: React.ReactNode;
    heading: React.ReactNode;
    description?: React.ReactNode;
}
export interface TimelineProps extends Omit<React.ComponentProps<"ol">, "className"> {
    items: TimelineItemConfig[];
    className?: string;
    classNames?: {
        item?: string;
        spine?: string;
        marker?: string;
        connector?: string;
        content?: string;
        time?: string;
        heading?: string;
        description?: string;
    };
    styles?: {
        item?: React.CSSProperties;
        spine?: React.CSSProperties;
        marker?: React.CSSProperties;
        connector?: React.CSSProperties;
        content?: React.CSSProperties;
        time?: React.CSSProperties;
        heading?: React.CSSProperties;
        description?: React.CSSProperties;
    };
}
export function Timeline({ items, className, classNames, styles, ...props }: TimelineProps) {
    return (<TimelineRoot {...props} className={className}>
      {items.map((item, i) => (<TimelineItem key={String(item.heading)} connector={i < items.length - 1} marker={item.marker} time={item.time} heading={item.heading} description={item.description} classNames={classNames} styles={styles}/>))}
    </TimelineRoot>);
}
