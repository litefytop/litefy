"use client";
import * as React from "react";
import { Children, isValidElement } from "react";
import { getSchemeDurationMs } from "../utils/scheme-duration";
export type PagerTransition = "none" | "slide";
export interface PagerProps extends Omit<React.ComponentProps<"div">, "children" | "className" | "onChange"> {
    index: number;
    onChange: (nextIndex: number) => void;
    children: React.ReactNode[];
    loop?: boolean;
    transition?: PagerTransition;
    gesture?: boolean;
    className?: string;
}
interface DragState {
    from: number;
    offset: number;
    settling: boolean;
}
interface SlideState {
    from: number;
    to: number;
    dir: 1 | -1;
}
const DURATION_HOOK = "--duration-md";
const FALLBACK_MS = 200;
const DRAG_RATIO = 0.25;
const ROOT_STYLE: React.CSSProperties = { overflow: "hidden" };
const VIEWPORT_STYLE: React.CSSProperties = { position: "relative", width: "100%", height: "100%", touchAction: "pan-y", userSelect: "none" };
const TRACK_STYLE: React.CSSProperties = { position: "relative", width: "100%", height: "100%" };
const LAYER_STYLE: React.CSSProperties = { position: "absolute", top: 0, bottom: 0, left: 0, width: "100%", height: "100%" };
const PAGE_STYLE: React.CSSProperties = { width: "100%", height: "100%" };
const TRACK_TRANSITION = `transform var(${DURATION_HOOK}, ${FALLBACK_MS}ms) ease-out`;
const SHIFT = {
    prev: "translateX(-100%)",
    next: "translateX(100%)"
};
export function Pager({ index, onChange, children, loop = false, transition = "slide", gesture = true, className, style, ...props }: PagerProps) {
    const slides = Children.toArray(children).filter((child) => isValidElement(child));
    const total = slides.length;
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const touchRef = React.useRef<{
        startX: number;
        from: number;
    } | null>(null);
    const offsetRef = React.useRef(0);
    const gestureLockRef = React.useRef(false);
    const gestureCommitRef = React.useRef(false);
    const slidingRef = React.useRef(false);
    const slideTimerRef = React.useRef(0);
    const settleTimerRef = React.useRef(0);
    const dragFrameRef = React.useRef(0);
    React.useEffect(() => () => {
        window.clearTimeout(slideTimerRef.current);
        window.clearTimeout(settleTimerRef.current);
        if (dragFrameRef.current)
            cancelAnimationFrame(dragFrameRef.current);
    }, []);
    const [drag, setDrag] = React.useState<DragState | null>(null);
    const [slide, setSlide] = React.useState<SlideState | null>(null);
    const [renderedIndex, setRenderedIndex] = React.useState(index);
    const settleMs = React.useCallback(() => (viewportRef.current ? getSchemeDurationMs(viewportRef.current, DURATION_HOOK) : 0) || FALLBACK_MS, []);
    const normalize = React.useCallback((i: number) => total === 0 ? 0 : loop ? ((i % total) + total) % total : Math.max(0, Math.min(i, total - 1)), [loop, total]);
    React.useEffect(() => {
        if (index === renderedIndex || total === 0)
            return;
        if (gestureCommitRef.current)
            return;
        const target = normalize(index);
        if (slidingRef.current) {
            window.clearTimeout(slideTimerRef.current);
            slidingRef.current = false;
            setSlide(null);
            setRenderedIndex(target);
            return;
        }
        if (transition === "none" || !viewportRef.current?.clientWidth) {
            setRenderedIndex(target);
            return;
        }
        const current = normalize(renderedIndex);
        const fwd = (target - current + total) % total;
        const dir: 1 | -1 = fwd <= total / 2 ? 1 : -1;
        slidingRef.current = true;
        setSlide({ from: current, to: target, dir });
        slideTimerRef.current = window.setTimeout(() => {
            slidingRef.current = false;
            setSlide(null);
            setRenderedIndex(target);
        }, settleMs());
    }, [index, renderedIndex, transition, normalize, total, settleMs]);
    const canGo = (from: number, dir: 1 | -1) => loop || (dir === 1 ? from < total - 1 : from > 0);
    const resist = (from: number, dx: number) => {
        if (loop)
            return dx;
        if ((dx < 0 && from >= total - 1) || (dx > 0 && from <= 0))
            return dx * 0.3;
        return dx;
    };
    const commit = (from: number, dir: 1 | -1) => {
        const target = normalize(from + dir);
        const width = viewportRef.current?.clientWidth ?? 0;
        gestureCommitRef.current = true;
        gestureLockRef.current = true;
        setDrag({ from, offset: -dir * width, settling: true });
        onChange(target);
        settleTimerRef.current = window.setTimeout(() => {
            gestureCommitRef.current = false;
            gestureLockRef.current = false;
            setDrag(null);
            setRenderedIndex(target);
        }, settleMs());
    };
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (gestureLockRef.current || slidingRef.current)
            return;
        touchRef.current = { startX: e.touches[0].clientX, from: renderedIndex };
        offsetRef.current = 0;
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = touchRef.current;
        if (!touch)
            return;
        const dx = resist(touch.from, e.touches[0].clientX - touch.startX);
        offsetRef.current = dx;
        if (!dragFrameRef.current) {
            dragFrameRef.current = requestAnimationFrame(() => {
                dragFrameRef.current = 0;
                const active = touchRef.current;
                if (active)
                    setDrag({ from: active.from, offset: offsetRef.current, settling: false });
            });
        }
    };
    const handleTouchEnd = () => {
        if (dragFrameRef.current) {
            cancelAnimationFrame(dragFrameRef.current);
            dragFrameRef.current = 0;
        }
        const touch = touchRef.current;
        touchRef.current = null;
        if (!touch)
            return;
        const dx = offsetRef.current;
        const width = viewportRef.current?.clientWidth ?? 0;
        const dir = dx <= -width * DRAG_RATIO ? 1 : dx >= width * DRAG_RATIO ? -1 : 0;
        gestureLockRef.current = true;
        if (dir !== 0 && canGo(touch.from, dir)) {
            commit(touch.from, dir);
        }
        else {
            setDrag({ from: touch.from, offset: 0, settling: true });
            settleTimerRef.current = window.setTimeout(() => {
                gestureLockRef.current = false;
                setDrag(null);
            }, settleMs());
        }
    };
    if (total === 0)
        return null;
    const current = normalize(renderedIndex);
    const prevIndex = loop ? (current - 1 + total) % total : current > 0 ? current - 1 : null;
    const nextIndex = loop ? (current + 1) % total : current < total - 1 ? current + 1 : null;
    const animating = Boolean(drag?.settling || slide);
    const gestureHandlers = gesture
        ? {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            onTouchCancel: handleTouchEnd,
        }
        : {};
    return (<div {...props} className={className} style={{ ...ROOT_STYLE, ...style }}>
      <div ref={viewportRef} style={VIEWPORT_STYLE} {...gestureHandlers}>
        <div data-animating={animating || undefined} style={{ ...TRACK_STYLE, transform: drag ? `translateX(${drag.offset}px)` : slide ? `translateX(${slide.dir === 1 ? -100 : 100}%)` : undefined, transition: animating ? TRACK_TRANSITION : undefined }}>
          {drag && prevIndex !== null && (<div aria-hidden data-position="prev" style={{ ...LAYER_STYLE, transform: SHIFT.prev }}>
              {slides[prevIndex]}
            </div>)}
          <div style={PAGE_STYLE}>{slides[current]}</div>
          {slide && (<div aria-hidden data-position="slide" style={{ ...LAYER_STYLE, transform: `translateX(${slide.dir === 1 ? 100 : -100}%)` }}>
              {slides[slide.to]}
            </div>)}
          {drag && nextIndex !== null && (<div aria-hidden data-position="next" style={{ ...LAYER_STYLE, transform: SHIFT.next }}>
              {slides[nextIndex]}
            </div>)}
        </div>
      </div>
    </div>);
}
