"use client";
import * as React from "react";
import { Children, isValidElement } from "react";
import { type ClassNameValue, cn } from "../utils/cn";
export type PagerTransition = "none" | "slide";
export interface PagerProps extends Omit<React.ComponentProps<"div">, "children" | "className" | "onChange"> {
    index: number;
    onChange: (nextIndex: number) => void;
    children: React.ReactNode[];
    loop?: boolean;
    transition?: PagerTransition;
    gesture?: boolean;
    className?: ClassNameValue;
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
const SETTLE_MS = 200;
const DRAG_RATIO = 0.25;
export function Pager({ index, onChange, children, loop = false, transition = "slide", gesture = true, className, ...props }: PagerProps) {
    const slides = Children.toArray(children).filter(isValidElement);
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
    const [drag, setDrag] = React.useState<DragState | null>(null);
    const [slide, setSlide] = React.useState<SlideState | null>(null);
    const [renderedIndex, setRenderedIndex] = React.useState(index);
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
        }, SETTLE_MS);
    }, [index, renderedIndex, transition, normalize, total]);
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
        window.setTimeout(() => {
            gestureCommitRef.current = false;
            gestureLockRef.current = false;
            setDrag(null);
            setRenderedIndex(target);
        }, SETTLE_MS);
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
        setDrag({ from: touch.from, offset: dx, settling: false });
    };
    const handleTouchEnd = () => {
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
            window.setTimeout(() => {
                gestureLockRef.current = false;
                setDrag(null);
            }, SETTLE_MS);
        }
    };
    if (total === 0)
        return null;
    const current = normalize(renderedIndex);
    const prevIndex = loop ? (current - 1 + total) % total : current > 0 ? current - 1 : null;
    const nextIndex = loop ? (current + 1) % total : current < total - 1 ? current + 1 : null;
    const gestureHandlers = gesture
        ? {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            onTouchCancel: handleTouchEnd,
        }
        : {};
    return (<div {...props} className={cn("overflow-hidden", className)}>
      <div ref={viewportRef} className="relative h-full w-full touch-pan-y select-none" {...gestureHandlers}>
        <div className={cn("relative h-full w-full", (drag?.settling || slide) && "transition-transform duration-200 ease-out")} style={{ transform: drag ? `translateX(${drag.offset}px)` : slide ? `translateX(${slide.dir === 1 ? -100 : 100}%)` : undefined }}>
          {drag && prevIndex !== null && (<div aria-hidden className="absolute inset-y-0 left-0 h-full w-full -translate-x-full">
              {slides[prevIndex]}
            </div>)}
          <div className="h-full w-full">{slides[current]}</div>
          {slide && (<div aria-hidden className="absolute inset-y-0 left-0 h-full w-full" style={{ transform: `translateX(${slide.dir === 1 ? 100 : -100}%)` }}>
              {slides[slide.to]}
            </div>)}
          {drag && nextIndex !== null && (<div aria-hidden className="absolute inset-y-0 left-0 h-full w-full translate-x-full">
              {slides[nextIndex]}
            </div>)}
        </div>
      </div>
    </div>);
}
