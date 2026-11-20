"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "./icons";
export type TabsOrientation = "horizontal" | "vertical";
const EDGE = 3;
const TRIGGER_STYLE: React.CSSProperties = { flexShrink: 0 };
export interface TabsListProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
    orientation?: TabsOrientation;
    activeValue?: string;
    prevLabel?: string;
    nextLabel?: string;
    classNames?: {
        scroller?: string;
        scroll?: string;
    };
}
export function TabsList({ className, children, orientation = "horizontal", activeValue, prevLabel = "Scroll tabs left", nextLabel = "Scroll tabs right", classNames, ref, ...props }: TabsListProps) {
    const isHorizontal = orientation === "horizontal";
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const setScrollRef = (element: HTMLDivElement | null) => {
        scrollRef.current = element;
        if (typeof ref === "function") {
            ref(element);
        }
        else if (ref) {
            ref.current = element;
        }
    };
    const [edges, setEdges] = React.useState({ overflow: false, start: false, end: false });
    React.useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el)
            return;
        const update = () => {
            const client = isHorizontal ? el.clientWidth : el.clientHeight;
            const extent = isHorizontal ? el.scrollWidth : el.scrollHeight;
            if (!client)
                return;
            const start = isHorizontal ? el.scrollLeft > EDGE : false;
            const end = isHorizontal ? el.scrollLeft + client < extent - EDGE : false;
            const overflow = extent - client > EDGE;
            setEdges((prev) => prev.overflow === overflow && prev.start === start && prev.end === end ? prev : { overflow, start, end });
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        el.addEventListener("scroll", update);
        return () => {
            ro.disconnect();
            el.removeEventListener("scroll", update);
        };
    }, [isHorizontal]);
    const activeValueRef = React.useRef(activeValue);
    React.useLayoutEffect(() => {
        activeValueRef.current = activeValue;
        if (!isHorizontal)
            return;
        const scroller = scrollRef.current;
        const active = scroller?.querySelector<HTMLElement>(`[data-state="active"]`);
        if (!scroller || !active)
            return;
        const scrollerRect = scroller.getBoundingClientRect();
        const rect = active.getBoundingClientRect();
        if (rect.left < scrollerRect.left)
            scroller.scrollLeft += rect.left - scrollerRect.left;
        else if (rect.right > scrollerRect.right)
            scroller.scrollLeft += rect.right - scrollerRect.right;
    }, [activeValue, isHorizontal]);
    const scrollByEdge = (direction: -1 | 1) => {
        const el = scrollRef.current;
        if (!el)
            return;
        el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
    };
    const overflow = edges.overflow ? { "data-overflow": "true" } : undefined;
    if (isHorizontal) {
        return (<div {...props} {...overflow} data-orientation={orientation} className={className}>
        <button type="button" data-direction="prev" className={classNames?.scroll} onClick={() => scrollByEdge(-1)} disabled={!edges.start} aria-label={prevLabel}>
          <ChevronLeft aria-hidden/>
        </button>

        <div ref={setScrollRef} role="tablist" aria-orientation={orientation} className={classNames?.scroller}>
          {children}
        </div>

        <button type="button" data-direction="next" className={classNames?.scroll} onClick={() => scrollByEdge(1)} disabled={!edges.end} aria-label={nextLabel}>
          <ChevronRight aria-hidden/>
        </button>
      </div>);
    }
    return (<div {...props} {...overflow} ref={setScrollRef} role="tablist" aria-orientation={orientation} data-orientation={orientation} className={className}>
      {children}
    </div>);
}
export interface TabsTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
    value: string;
    active?: boolean;
    uid?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}
export function TabsTrigger({ value, active = false, uid, onValueChange, disabled, className, style, children, ...props }: TabsTriggerProps) {
    const scope = uid ? `tabs-${uid}-` : "tabs-";
    const triggerId = `${scope}trigger-${value}`;
    const panelId = `${scope}panel-${value}`;
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const el = e.currentTarget;
        const tablist = el.closest('[role="tablist"]');
        if (!tablist)
            return;
        const vertical = tablist.getAttribute("aria-orientation") === "vertical";
        const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
        const currentIndex = tabs.indexOf(el);
        if (e.key === "ArrowRight" || (vertical && e.key === "ArrowDown")) {
            e.preventDefault();
            const next = tabs[(currentIndex + 1) % tabs.length];
            next?.focus();
            return;
        }
        if (e.key === "ArrowLeft" || (vertical && e.key === "ArrowUp")) {
            e.preventDefault();
            const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
            prev?.focus();
            return;
        }
        if (e.key === "Home") {
            e.preventDefault();
            tabs[0]?.focus();
            return;
        }
        if (e.key === "End") {
            e.preventDefault();
            tabs.at(-1)?.focus();
            return;
        }
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled)
                onValueChange?.(value);
        }
    };
    return (<button {...props} type="button" id={triggerId} role="tab" aria-selected={active} aria-controls={panelId} data-value={value} data-state={active ? "active" : "inactive"} disabled={disabled} style={{ ...TRIGGER_STYLE, ...style }} onClick={() => !disabled && onValueChange?.(value)} onKeyDown={handleKeyDown} className={className}>
      {children}
    </button>);
}
export interface TabsContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    value: string;
    active?: boolean;
    uid?: string;
    unmountOnHide?: boolean;
    className?: string;
}
export function TabsContent({ value, active = false, uid, unmountOnHide = true, className, children, ...props }: TabsContentProps) {
    if (!active && unmountOnHide)
        return null;
    const scope = uid ? `tabs-${uid}-` : "tabs-";
    return (<div {...props} id={`${scope}panel-${value}`} role="tabpanel" aria-labelledby={`${scope}trigger-${value}`} data-state={active ? "active" : "inactive"} hidden={!active} style={active ? props.style : { display: "none", ...props.style }} className={className}>
      {children}
    </div>);
}
export interface TabsOptionConfig {
    value: string;
    label: React.ReactNode;
    content?: React.ReactNode;
    disabled?: boolean;
}
export interface TabsProps extends Omit<React.ComponentProps<"div">, "className"> {
    options: TabsOptionConfig[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: TabsOrientation;
    unmountOnHide?: boolean;
    panelClassName?: string;
    className?: string;
    prevLabel?: string;
    nextLabel?: string;
    classNames?: {
        root?: string;
        list?: string;
        scroll?: string;
        scroller?: string;
        trigger?: string;
        content?: string;
    };
}
export function Tabs({ options, value, defaultValue, onValueChange, orientation = "horizontal", unmountOnHide = true, panelClassName, className, prevLabel, nextLabel, classNames, ...props }: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? options[0]?.value ?? "");
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : uncontrolledValue;
    const uid = React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "");
    const handleValueChange = (val: string) => {
        if (!isControlled)
            setUncontrolledValue(val);
        onValueChange?.(val);
    };
    return (<div {...props} data-orientation={orientation} className={[classNames?.root, className].filter(Boolean).join(" ")}>
      <TabsList orientation={orientation} activeValue={selectedValue} prevLabel={prevLabel} nextLabel={nextLabel} className={classNames?.list} classNames={{ scroller: classNames?.scroller, scroll: classNames?.scroll }}>
        {options.map((option) => (<TabsTrigger key={option.value} value={option.value} uid={uid} active={selectedValue === option.value} disabled={option.disabled} onValueChange={handleValueChange} className={classNames?.trigger}>
            {option.label}
          </TabsTrigger>))}
      </TabsList>
      {options.map((option) => (<TabsContent key={option.value} value={option.value} uid={uid} active={selectedValue === option.value} unmountOnHide={unmountOnHide} className={[classNames?.content, panelClassName].filter(Boolean).join(" ")}>
          {option.content}
        </TabsContent>))}
    </div>);
}
