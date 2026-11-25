"use client";
import * as React from "react";
import { Check } from "./icons";
import { resolveSlotClassName, type SlotClassName } from "../utils/cn";
export type StepsOrientation = "horizontal" | "vertical";
export type StepsClassNames = {
    item?: string;
    marker?: SlotClassName;
    rail?: string;
    connector?: string;
    texts?: string;
    title?: SlotClassName;
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
}
export function StepsRoot({ className, ref, ...props }: StepsRootProps) {
    return <ol ref={ref} {...props} className={className}/>;
}
export type StepsItemState = "completed" | "current" | "upcoming";
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
    const disabled = !clickable;
    const markerClassName = resolveSlotClassName(classNames?.marker, { disabled });
    const titleClassName = resolveSlotClassName(classNames?.title, { disabled });
    const marker = (<button type="button" disabled={disabled} onClick={() => { if (!disabled) onSelect?.(index); }} data-state={state} data-clickable={clickable || undefined} data-disabled={disabled || undefined} className={markerClassName} style={styles?.marker}>
      {state === "completed" ? <Check aria-hidden/> : index + 1}
    </button>);
    const titleNode = clickable ? (<button type="button" onClick={() => onSelect?.(index)} data-state={state} data-clickable data-disabled={disabled || undefined} className={titleClassName} style={styles?.title}>
        {title}
      </button>) : (<span data-state={state} data-disabled={disabled || undefined} className={titleClassName} style={styles?.title}>
        {title}
      </span>);
    if (vertical) {
        return (<li aria-current={state === "current" ? "step" : undefined} {...props} data-state={state} className={[className, classNames?.item].filter(Boolean).join(" ")} style={{ ...styles?.item, ...style }}>
        <span className={classNames?.rail} style={styles?.rail}>
          {marker}
          {connector && (<span aria-hidden data-state={state} className={classNames?.connector} style={styles?.connector}/>)}
        </span>
        <span data-connector={connector || undefined} className={classNames?.texts} style={styles?.texts}>
          {titleNode}
          {description && (<span className={classNames?.description} style={styles?.description}>
              {description}
            </span>)}
          {children && <div className={classNames?.body} style={styles?.body}>{children}</div>}
        </span>
      </li>);
    }
    return (<li aria-current={state === "current" ? "step" : undefined} {...props} data-state={state} className={[className, classNames?.item].filter(Boolean).join(" ")} style={{ ...styles?.item, ...style }}>
      {connector && (<span aria-hidden data-state={state} className={classNames?.connector} style={styles?.connector}/>)}
      {marker}
      <span className={classNames?.texts} style={styles?.texts}>
        {titleNode}
        {description && (<span className={classNames?.description} style={styles?.description}>
            {description}
          </span>)}
        {children && <div className={classNames?.body} style={styles?.body}>{children}</div>}
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
    return (<StepsRoot {...props} className={className}>
      {items.map((item, i) => (<StepsItem key={String(item.title)} index={i} state={i < index ? "completed" : i === index ? "current" : "upcoming"} title={item.title} description={item.description} clickable={i <= maxIndex && i !== index} orientation={resolved} connector={resolved === "vertical" ? i < items.length - 1 : i > 0} onSelect={onChange} classNames={classNames} styles={styles}>
          {i === index ? item.content : undefined}
        </StepsItem>))}
    </StepsRoot>);
}
