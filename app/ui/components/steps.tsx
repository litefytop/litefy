"use client";
import * as React from "react";
import { Check } from "./icons";
export type StepsOrientation = "horizontal" | "vertical";
export type StepsClassNames = {
    item?: string;
    marker?: string;
    rail?: string;
    connector?: string;
    texts?: string;
    title?: string;
    description?: string;
    body?: string;
};
export interface StepsStyles {
    item?: React.CSSProperties;
    marker?: React.CSSProperties;
    rail?: React.CSSProperties;
    connector?: React.CSSProperties;
    texts?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    body?: React.CSSProperties;
}
export interface StepsRootProps extends Omit<React.ComponentProps<"ol">, "className"> {
    className?: string;
    orientation?: StepsOrientation;
}
export function StepsRoot({ className, orientation = "horizontal", ref, ...props }: StepsRootProps) {
    return <ol ref={ref} {...props} data-orientation={orientation} className={className}/>;
}
export type StepsItemState = "completed" | "current" | "upcoming" | "finished";
export interface StepsItemProps extends Omit<React.ComponentProps<"li">, "className" | "title" | "onSelect"> {
    index: number;
    state: StepsItemState;
    title: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    clickable?: boolean;
    orientation?: StepsOrientation;
    connector?: boolean;
    onSelect?: (index: number) => void;
    className?: string;
    classNames?: StepsClassNames;
    styles?: StepsStyles;
}
export function StepsItem({ index, state, title, description, children, clickable, orientation = "horizontal", connector, onSelect, className, style, classNames, styles, ...props }: StepsItemProps) {
    const vertical = orientation === "vertical";
    const marker = (<button type="button" disabled={!clickable} onClick={() => onSelect?.(index)} data-state={state} data-clickable={clickable || undefined} className={classNames?.marker} style={styles?.marker}>
      {state === "completed" || state === "finished" ? <Check aria-hidden/> : index + 1}
    </button>);
    const titleNode = clickable ? (<button type="button" onClick={() => onSelect?.(index)} data-state={state} data-orientation={orientation} data-clickable={clickable || undefined} className={classNames?.title} style={styles?.title}>
        {title}
      </button>) : (<span data-state={state} data-orientation={orientation} className={classNames?.title} style={styles?.title}>
        {title}
      </span>);
    if (vertical) {
        return (<li aria-current={state === "current" ? "step" : undefined} {...props} data-state={state} data-orientation="vertical" className={[className, classNames?.item].filter(Boolean).join(" ")} style={{ ...styles?.item, ...style }}>
        <span className={classNames?.rail} style={styles?.rail}>
          {marker}
          {connector && (<span aria-hidden data-state={state} data-orientation="vertical" className={classNames?.connector} style={styles?.connector}/>)}
        </span>
        <span data-connector={connector || undefined} data-orientation="vertical" className={classNames?.texts} style={styles?.texts}>
          {titleNode}
          {description && (<span data-orientation="vertical" className={classNames?.description} style={styles?.description}>
              {description}
            </span>)}
          {children && <div data-orientation="vertical" className={classNames?.body} style={styles?.body}>{children}</div>}
        </span>
      </li>);
    }
    return (<li aria-current={state === "current" ? "step" : undefined} {...props} data-state={state} data-orientation="horizontal" className={[className, classNames?.item].filter(Boolean).join(" ")} style={{ ...styles?.item, ...style }}>
      {connector && (<span aria-hidden data-state={state} data-orientation="horizontal" className={classNames?.connector} style={styles?.connector}/>)}
      {marker}
      <span data-orientation="horizontal" className={classNames?.texts} style={styles?.texts}>
        {titleNode}
        {description && (<span data-orientation="horizontal" className={classNames?.description} style={styles?.description}>
            {description}
          </span>)}
        {children && <div data-orientation="horizontal" className={classNames?.body} style={styles?.body}>{children}</div>}
      </span>
    </li>);
}
export interface StepsItemConfig {
    title: React.ReactNode;
    description?: React.ReactNode;
    content?: React.ReactNode;
}
export interface StepsProps extends Omit<React.ComponentProps<"ol">, "className" | "onChange"> {
    items: StepsItemConfig[];
    index: number;
    orientation?: StepsOrientation;
    onChange?: (nextIndex: number) => void;
    maxIndex?: number;
    className?: string;
    classNames?: StepsClassNames;
    styles?: StepsStyles;
}
export function Steps({ items, index, orientation, onChange, maxIndex = items.length - 1, className, classNames, styles, ...props }: StepsProps) {
    const resolved = orientation ?? "horizontal";
    return (<StepsRoot {...props} orientation={resolved} className={className}>
      {items.map((item, i) => (<StepsItem key={String(item.title)} index={i} state={i < index ? (i === items.length - 1 ? "finished" : "completed") : i === index ? "current" : "upcoming"} title={item.title} description={item.description} clickable={i <= maxIndex && i !== index} orientation={resolved} connector={resolved === "vertical" ? i < items.length - 1 : i > 0} onSelect={onChange} classNames={classNames} styles={styles}>
          {i === index ? item.content : undefined}
        </StepsItem>))}
    </StepsRoot>);
}
