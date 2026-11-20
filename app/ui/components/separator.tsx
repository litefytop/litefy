"use client";
import * as React from "react";

function lineStyle(orientation: "horizontal" | "vertical"): React.CSSProperties {
    return {
        flexShrink: 0,
        ...(orientation === "horizontal" ? { flex: 1 } : { alignSelf: "stretch" }),
    };
}

export interface SeparatorLineProps extends Omit<React.ComponentProps<"div">, "className" | "style"> {
    className?: string;
    orientation?: "horizontal" | "vertical";
    style?: React.CSSProperties;
}
export function SeparatorLine({ className, orientation = "horizontal", style, ...props }: SeparatorLineProps) {
    return (<div {...props} data-orientation={orientation} style={{ ...lineStyle(orientation), ...style }} className={className}/>);
}
export interface SeparatorTextProps extends Omit<React.ComponentProps<"span">, "className" | "style"> {
    className?: string;
    style?: React.CSSProperties;
}
export function SeparatorText({ className, style, ...props }: SeparatorTextProps) {
    return (<span {...props} style={{ whiteSpace: "nowrap", ...style }} className={className}/>);
}
export interface SeparatorProps {
    orientation?: "horizontal" | "vertical";
    children?: React.ReactNode;
    className?: string;
    classNames?: {
        line?: string;
        text?: string;
    };
    styles?: {
        line?: React.CSSProperties;
        text?: React.CSSProperties;
    };
}
export function Separator({ orientation = "horizontal", children, className, classNames, styles, }: SeparatorProps) {
    const containerStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        ...(orientation === "horizontal" ? { flexDirection: "row" } : { flexDirection: "column", alignSelf: "stretch" }),
    };
    if (!children) {
        return (<SeparatorLine role="separator" orientation={orientation} className={className} style={{ flex: "none" }}/>);
    }
    return (<div role="separator" data-orientation={orientation} style={containerStyle} className={className}>
      <SeparatorLine orientation={orientation} className={classNames?.line} style={styles?.line}/>
      <SeparatorText className={classNames?.text} style={styles?.text}>
        {children}
      </SeparatorText>
      <SeparatorLine orientation={orientation} className={classNames?.line} style={styles?.line}/>
    </div>);
}
