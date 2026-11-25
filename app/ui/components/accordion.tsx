import * as React from "react";
import { Collapse, CollapseRoot } from "./collapse";
import type { CollapseProps, CollapseRootProps } from "./collapse";
export interface CollapseItemConfig extends Omit<CollapseProps, "children" | "open" | "onOpenChange" | "itemKey"> {
    panel: React.ReactNode;
    itemKey: string;
}
export interface AccordionRootProps extends CollapseRootProps {
    items: CollapseItemConfig[];
    disabled?: boolean;
    common?: {
        className?: string;
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
        icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
    };
}
export interface MultipleAccordionProps extends AccordionRootProps {
    multiple: true;
    defaultActiveKeys?: string[];
    activeKeys?: string[];
    onKeyChange?: (values: string[]) => void;
}
export interface SingleAccordionProps extends AccordionRootProps {
    multiple?: false;
    defaultActiveKeys?: string;
    activeKeys?: string | undefined;
    onKeyChange?: (value: string | undefined) => void;
}
export type AccordionProps = MultipleAccordionProps | SingleAccordionProps;
export function Accordion({ items, multiple = false, activeKeys, defaultActiveKeys, onKeyChange, common, disabled, ...props }: AccordionProps) {
    const [_activeKeys, setActiveKeys] = React.useState<string[]>(() => {
        if (multiple) {
            return (defaultActiveKeys as string[] | undefined) ?? [];
        }
        const val = defaultActiveKeys as string | undefined;
        return val ? [val] : [];
    });
    const isControlled = activeKeys !== undefined;
    let activeKeys$: string[];
    if (isControlled) {
        if (multiple) {
            activeKeys$ = activeKeys as string[];
        }
        else {
            const val = activeKeys as string | undefined;
            activeKeys$ = val ? [val] : [];
        }
    }
    else {
        activeKeys$ = _activeKeys;
    }
    const handleToggle = (itemKey: string) => {
        const isCurrentlyOpen = activeKeys$.includes(itemKey);
        let nextKeys: string[];
        if (multiple) {
            nextKeys = isCurrentlyOpen
                ? activeKeys$.filter((k) => k !== itemKey)
                : [...activeKeys$, itemKey];
        }
        else {
            nextKeys = isCurrentlyOpen ? [] : [itemKey];
        }
        if (!isControlled) {
            setActiveKeys(nextKeys);
        }
        if (multiple) {
            (onKeyChange as MultipleAccordionProps["onKeyChange"])?.(nextKeys);
        }
        else {
            (onKeyChange as SingleAccordionProps["onKeyChange"])?.(nextKeys[0] || "");
        }
    };
    return (<CollapseRoot {...props} aria-disabled={disabled || props["aria-disabled"]} data-disabled={disabled || undefined}>
      {items.map(({ panel, ...cfg }) => {
            return (<Collapse key={cfg.itemKey} {...cfg} disabled={disabled || cfg.disabled} className={cfg.className ?? common?.className} classNames={{
                    trigger: cfg.classNames?.trigger ?? common?.classNames?.trigger,
                    icon: cfg.classNames?.icon ?? common?.classNames?.icon,
                    panel: cfg.classNames?.panel ?? common?.classNames?.panel,
                    body: cfg.classNames?.body ?? common?.classNames?.body,
                }} styles={{
                    trigger: cfg.styles?.trigger ?? common?.styles?.trigger,
                    icon: cfg.styles?.icon ?? common?.styles?.icon,
                    panel: cfg.styles?.panel ?? common?.styles?.panel,
                    body: cfg.styles?.body ?? common?.styles?.body,
                }} icon={cfg.icon ?? common?.icon} open={activeKeys$.includes(cfg.itemKey)} onOpenChange={() => handleToggle(cfg.itemKey)}>
            {panel}
          </Collapse>);
        })}
    </CollapseRoot>);
}
