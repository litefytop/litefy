import { ChevronDown } from "./icons";
import * as React from "react";
export interface DetailsProps extends Omit<React.ComponentProps<"details">, "className"> {
    className?: string;
    label?: React.ReactNode;
    icon?: React.ReactNode;
    classNames?: {
        summary?: string;
        icon?: string;
        body?: string;
    };
    styles?: {
        summary?: React.CSSProperties;
        icon?: React.CSSProperties;
        body?: React.CSSProperties;
    };
}
export function Details({ label, icon, className, classNames, styles, children, ...props }: DetailsProps) {
    const iconNode = icon === undefined ? <ChevronDown /> : icon;
    return (<details {...props} className={className}>
      <summary className={classNames?.summary} style={styles?.summary}>
        {label}
        {iconNode !== null && (<span aria-hidden className={classNames?.icon} style={styles?.icon}>{iconNode}</span>)}
      </summary>
      <div className={classNames?.body} style={styles?.body}>{children}</div>
    </details>);
}
