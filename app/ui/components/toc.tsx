"use client";
import * as React from "react";
import { ChevronDown } from "./icons";
import { PopoverContent, usePopoverTrigger } from "./popover";
import { useScrollSpy } from "../utils/use-scroll-spy";
export interface TocItem {
    id: string;
    label: React.ReactNode;
    depth?: number;
}
export interface TocProps extends Omit<React.ComponentProps<"nav">, "className" | "title"> {
    items: TocItem[];
    title?: React.ReactNode;
    className?: string;
    classNames?: {
        rail?: string;
        title?: string;
        scroll?: string;
        list?: string;
        item?: string;
        thumb?: string;
        status?: string;
        ring?: string;
        ringTrack?: string;
        ringProgress?: string;
        current?: string;
        chevron?: string;
        panel?: string;
    };
    styles?: {
        rail?: React.CSSProperties;
        title?: React.CSSProperties;
        scroll?: React.CSSProperties;
        list?: React.CSSProperties;
        item?: React.CSSProperties;
        status?: React.CSSProperties;
        ring?: React.CSSProperties;
        panel?: React.CSSProperties;
    };
}
const RING_RADIUS = 9;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
function useScrollProgress(navRef: React.RefObject<HTMLElement | null>): number {
    const [progress, setProgress] = React.useState(0);
    React.useEffect(() => {
        let frame = 0;
        const findScroller = () => {
            let el = navRef.current?.parentElement ?? null;
            while (el && el.scrollHeight <= el.clientHeight)
                el = el.parentElement;
            return el;
        };
        const read = (el: HTMLElement | null) => {
            if (!el) {
                setProgress(1);
                return;
            }
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 1);
        };
        const update = (target?: EventTarget | null) => {
            frame = 0;
            const nav = navRef.current;
            if (target instanceof HTMLElement && nav && target !== nav && target.contains(nav)) {
                read(target);
                return;
            }
            read(findScroller());
        };
        const onScroll = (e: Event) => {
            if (!frame)
                frame = requestAnimationFrame(() => update(e.target));
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true, capture: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll, { capture: true });
            window.removeEventListener("resize", onScroll);
            if (frame)
                cancelAnimationFrame(frame);
        };
    }, [navRef]);
    return progress;
}
export function Toc({ items, title, className, classNames, styles, ...props }: TocProps) {
    const navRef = React.useRef<HTMLElement>(null);
    const activeIds = useScrollSpy(items.map((item) => item.id));
    const progress = useScrollProgress(navRef);
    const [panelOpen, setPanelOpen] = React.useState(false);
    const panelId = `toc-panel-${React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "")}`;
    const { triggerProps, contentProps, anchorName } = usePopoverTrigger({ open: panelOpen, onOpenChange: setPanelOpen });
    const listRef = React.useRef<HTMLUListElement>(null);
    const [thumb, setThumb] = React.useState<{ y: number; scale: number } | null>(null);
    React.useEffect(() => {
        const root = listRef.current;
        if (!root)
            return;
        const update = () => {
            const actives = Array.from(root.querySelectorAll<HTMLElement>("[data-active]"));
            if (actives.length === 0) {
                setThumb((prev) => (prev === null ? prev : null));
                return;
            }
            const rootTop = root.getBoundingClientRect().top;
            const first = actives[0].getBoundingClientRect();
            const last = actives.at(-1)!.getBoundingClientRect();
            const y = first.top - rootTop;
            const scale = root.clientHeight > 0 ? (last.bottom - first.top) / root.clientHeight : 0;
            setThumb((prev) => prev && Math.abs(prev.y - y) < 0.5 && Math.abs(prev.scale - scale) < 0.005 ? prev : { y, scale });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(root);
        return () => observer.disconnect();
    });
    if (items.length === 0)
        return null;
    const current = items.find((item) => item.id === activeIds[0]);
    const renderLinks = (inPanel: boolean) => items.map((item) => {
        const active = activeIds.includes(item.id);
        return (<li key={item.id}>
          <a href={`#${item.id}`} data-active={active || undefined} data-depth={item.depth} className={classNames?.item} style={styles?.item} onClick={inPanel ? () => setPanelOpen(false) : undefined}>
            {item.label}
          </a>
        </li>);
    });
    return (<nav ref={navRef} aria-label={typeof title === "string" ? title : undefined} {...props} className={className}>
      <div className={classNames?.rail} style={styles?.rail}>
        {title !== undefined && (<p className={classNames?.title} style={styles?.title}>{title}</p>)}
        <div className={classNames?.scroll} style={styles?.scroll}>
          <ul ref={listRef} className={classNames?.list} style={styles?.list}>
            {renderLinks(false)}
          </ul>
          {thumb && (<div aria-hidden className={classNames?.thumb} style={{ transform: `translateY(${thumb.y}px) scaleY(${thumb.scale})` }}/>) }
        </div>
      </div>
      <button type="button" {...triggerProps} aria-haspopup={undefined} aria-controls={panelId} data-open={panelOpen || undefined} className={classNames?.status} style={styles?.status}>
        <svg viewBox="0 0 24 24" className={classNames?.ring} style={styles?.ring}>
          <circle className={classNames?.ringTrack} cx="12" cy="12" r={RING_RADIUS}/>
          <circle className={classNames?.ringProgress} cx="12" cy="12" r={RING_RADIUS} strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}/>
        </svg>
        <span className={classNames?.current}>{current?.label ?? title}</span>
        <ChevronDown aria-hidden className={classNames?.chevron} data-open={panelOpen || undefined}/>
      </button>
      <PopoverContent {...contentProps} id={panelId} open={panelOpen} onOpenChange={setPanelOpen} anchorName={anchorName} placement={{ side: "bottom", align: "end", gap: 8 }} className={classNames?.panel} style={styles?.panel}>
        <ul className={classNames?.list} style={styles?.list}>
          {renderLinks(true)}
        </ul>
      </PopoverContent>
    </nav>);
}
