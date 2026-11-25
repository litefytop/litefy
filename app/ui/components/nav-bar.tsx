"use client";
import * as React from "react";
import { ButtonRoot } from "./button";
import { ChevronDown } from "./icons";
import { PopoverContent, usePopoverTrigger } from "./popover";
import type { FloatingPlacement } from "../utils/floating-position";
const GAP = "0.25rem";
const ROOT_STYLE: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    gap: GAP,
};
const ITEM_STYLE: React.CSSProperties = { flex: "none", minWidth: 0 };
const MORE_STYLE: React.CSSProperties = { flex: "none" };
const PANEL_STYLE: React.CSSProperties = {
    flexDirection: "column",
};
const PANEL_ITEM_STYLE: React.CSSProperties = { minWidth: 0 };
export interface NavBarProps<T> extends Omit<React.ComponentProps<"nav">, "children" | "className" | "style"> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => React.Key;
    more?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnSelect?: boolean;
    placement?: FloatingPlacement;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        root?: string;
        item?: string;
        more?: string;
        chevron?: string;
        panel?: string;
    };
    styles?: {
        root?: React.CSSProperties;
        item?: React.CSSProperties;
        more?: React.CSSProperties;
        panel?: React.CSSProperties;
    };
}
export function NavBar<T>({ items, renderItem, getKey, more = "more", open, onOpenChange, closeOnSelect = true, placement, className, style, classNames, styles, ref, ...props }: NavBarProps<T>) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const isControlled = open !== undefined;
    const handleOpenChange = React.useCallback((next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    const panelOpen = isControlled ? Boolean(open) : uncontrolledOpen;
    const panelId = `nav-bar-panel-${React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "")}`;
    const { triggerProps, contentProps, anchorName } = usePopoverTrigger({
        open: panelOpen,
        onOpenChange: handleOpenChange,
    });
    const handleSelect = () => {
        if (closeOnSelect) handleOpenChange(false);
    };
    const rootRef = React.useRef<HTMLElement | null>(null);
    const moreRef = React.useRef<HTMLButtonElement | null>(null);
    const setRootRef = (element: HTMLElement | null) => {
        rootRef.current = element;
        if (typeof ref === "function") {
            ref(element);
        }
        else if (ref) {
            ref.current = element;
        }
    };
    const [visibleCount, setVisibleCount] = React.useState(items.length);
    const shown = Math.min(visibleCount, items.length);
    const measure = React.useCallback(() => {
        const root = rootRef.current;
        const trigger = moreRef.current;
        if (!root || !trigger)
            return;
        const row = Array.from(root.querySelectorAll<HTMLElement>("[data-nav-index]"));
        if (!row.length)
            return;
        row.forEach((node) => { node.style.display = ""; });
        trigger.style.display = "";
        const computed = getComputedStyle(root);
        const gap = computed.columnGap === "normal" ? 0 : Number.parseFloat(computed.columnGap) || 0;
        const available = root.clientWidth - (Number.parseFloat(computed.paddingLeft) || 0) - (Number.parseFloat(computed.paddingRight) || 0);
        const widths = row.map((node) => node.offsetWidth);
        let count = row.length;
        if (widths.reduce((total, width) => total + width, 0) + gap * (row.length - 1) > available) {
            let used = trigger.offsetWidth + gap;
            count = 0;
            for (let index = 0; index < row.length; index++) {
                const width = widths[index] + (index > 0 ? gap : 0);
                if (used + width > available)
                    break;
                used += width;
                count = index + 1;
            }
        }
        row.forEach((node, index) => { node.style.display = index < count ? "" : "none"; });
        trigger.style.display = count < row.length ? "" : "none";
        setVisibleCount((previous) => previous === count ? previous : count);
    }, []);
    React.useLayoutEffect(() => { measure(); });
    React.useEffect(() => {
        const root = rootRef.current;
        if (!root)
            return;
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        return () => observer.disconnect();
    }, [measure]);
    const moreContent = (<>{more}<span className={classNames?.chevron}><ChevronDown aria-hidden /></span></>);
    const overflow = shown < items.length ? { "data-overflow": "true" } : undefined;
    const renderRow = (item: T, index: number) => (<div key={String(getKey?.(item, index) ?? index)} data-nav-index={index} className={classNames?.item} style={{ ...ITEM_STYLE, ...styles?.item, display: index >= shown ? "none" : undefined }}>
      {renderItem(item, index)}
    </div>);
    const renderPanelItem = (item: T, index: number) => (<div key={String(getKey?.(item, index) ?? index)} onClick={handleSelect} className={classNames?.item} style={{ ...PANEL_ITEM_STYLE, ...styles?.item }}>
      {renderItem(item, index)}
    </div>);
    return (<nav {...props} {...overflow} ref={setRootRef} className={[classNames?.root, className].filter(Boolean).join(" ")} style={{ ...ROOT_STYLE, ...styles?.root, ...style }}>
      {items.map((item, index) => renderRow(item, index))}
      <ButtonRoot ref={moreRef} {...triggerProps} type="button" aria-haspopup={undefined} aria-controls={panelId} data-open={panelOpen || undefined} className={classNames?.more} style={{ ...MORE_STYLE, ...styles?.more, display: shown < items.length ? undefined : "none" }}>{moreContent}</ButtonRoot>
      <PopoverContent {...contentProps} id={panelId} open={panelOpen} onOpenChange={handleOpenChange} anchorName={anchorName} placement={{ side: "bottom", align: "end", gap: 8, ...placement }} className={classNames?.panel} style={{ ...PANEL_STYLE, display: panelOpen ? "flex" : "none", ...styles?.panel }}>
        {items.slice(shown).map((item, index) => renderPanelItem(item, index))}
      </PopoverContent>
    </nav>);
}
