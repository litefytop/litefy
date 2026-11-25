import { ChevronDown } from "./icons";
import * as React from "react";
export interface CollapseRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function CollapseRoot({ children, className, ...props }: CollapseRootProps) {
    return (<div {...props} className={className}>
      {children}
    </div>);
}
export interface CollapseTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
    open?: boolean;
}
export function CollapseTrigger({ children, className, open, onClick, ...props }: CollapseTriggerProps) {
    return (<button {...props} type="button" aria-expanded={open} className={className} onClick={onClick}>
      {children}
    </button>);
}
export interface CollapsePanelProps extends Omit<React.ComponentProps<"section">, "className" | "style"> {
    className?: string;
    style?: React.CSSProperties;
    open?: boolean;
    classNames?: {
        panel?: string;
        body?: string;
    };
    styles?: {
        panel?: React.CSSProperties;
        body?: React.CSSProperties;
    };
}
export function CollapsePanel({ children, className, style, open, classNames, styles, ...props }: CollapsePanelProps) {
    return (<section {...props} data-open={open} className={[className, classNames?.panel].filter(Boolean).join(" ")} style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        ...styles?.panel,
        ...style,
    }}>
      <div style={{ overflow: "hidden", minHeight: 0 }}>
        <div className={classNames?.body} style={{ ...styles?.body }}>{children}</div>
      </div>
    </section>);
}
export interface CollapseProps extends Omit<CollapseRootProps, "className" | "style"> {
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    label?: React.ReactNode | ((open: boolean) => React.ReactNode);
    icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    itemKey?: string;
    classNames?: {
        trigger?: string;
        icon?: string;
        panel?: string;
        body?: string;
    };
    styles?: {
        trigger?: React.CSSProperties;
        icon?: React.CSSProperties;
        panel?: React.CSSProperties;
        body?: React.CSSProperties;
    };
}
export function Collapse({ label, icon, open, defaultOpen = false, children, itemKey, onOpenChange, className, style, styles, classNames, disabled, ...props }: CollapseProps) {
    const id = React.useId();
    const [_open, setOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const open$ = isControlled ? open : _open;
    const handleToggle = () => {
        const next = !open$;
        if (!isControlled) {
            setOpen(next);
        }
        onOpenChange?.(next);
    };
    const panelId = `acc-panel-${itemKey ?? id}`;
    const triggerId = `acc-trigger-${itemKey ?? id}`;
    const labelNode = typeof label === "function" ? label(open$) : label;
    const iconNode = typeof icon === "function" ? icon(open$) : icon;
    return (<CollapseRoot {...props} className={className} style={style} aria-disabled={disabled || props["aria-disabled"]} data-disabled={disabled || undefined}>
      <CollapseTrigger open={open$} id={triggerId} aria-controls={panelId} onClick={handleToggle} disabled={disabled} className={classNames?.trigger} style={styles?.trigger}>
        {labelNode}
        {iconNode ?? (<ChevronDown data-open={open$} aria-hidden className={classNames?.icon} style={styles?.icon}/>)}
      </CollapseTrigger>
      <CollapsePanel open={open$} id={panelId} aria-labelledby={triggerId} classNames={{ panel: classNames?.panel, body: classNames?.body }} styles={{ panel: styles?.panel, body: styles?.body }}>
        {children}
      </CollapsePanel>
    </CollapseRoot>);
}
