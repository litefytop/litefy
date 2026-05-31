"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { cn, ClassNameValue } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type CarouselProps = {
  children: React.ReactNode;
  activeIndex: number;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"div">>;
    slide?: HTMLAttrs<React.ComponentProps<"div">>;
  };
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
  onChange?: (index: number) => void;
};

export function Carousel({
  children,
  activeIndex,
  slotProps,
  autoPlay = false,
  autoPlayInterval = 3000,
  loop = false,
  onChange,
}: CarouselProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const totalSlides = slides.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const currentIndexRef = useRef(0);

  const safeInterval = Math.max(100, autoPlayInterval);
  const currentIndex = Math.max(0, Math.min(activeIndex, totalSlides - 1));

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const goNext = useCallback(() => {
    if (isTransitioning.current || totalSlides <= 1) return;

    const nextIdx = currentIndexRef.current + 1;
    const targetIdx = nextIdx >= totalSlides ? (loop ? 0 : totalSlides - 1) : nextIdx;
    if (targetIdx !== currentIndexRef.current) {
      onChange?.(targetIdx);
    }
  }, [totalSlides, loop, onChange]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (totalSlides <= 1) {
      clearTimer();
      return;
    }

    if (autoPlay) {
      timerRef.current = setInterval(goNext, safeInterval) ;
    } else {
      clearTimer();
    }

    const el = rootRef.current;
    if (!el) return;

    const onPause = clearTimer;
    const onResume = () => {
      if (autoPlay) {
        clearTimer();
        timerRef.current = setInterval(goNext, safeInterval);
      }
    };

    el.addEventListener("mouseenter", onPause);
    el.addEventListener("mouseleave", onResume);
    el.addEventListener("touchstart", onPause, { passive: true });
    el.addEventListener("touchend", onResume, { passive: true });

    return () => {
      clearTimer();
      el.removeEventListener("mouseenter", onPause);
      el.removeEventListener("mouseleave", onResume);
      el.removeEventListener("touchstart", onPause);
      el.removeEventListener("touchend", onResume);
    };
  }, [autoPlay, safeInterval, goNext, totalSlides, clearTimer]);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    let isEventFired = false;
    const onTransitionEnd = () => {
      if (isEventFired) return;
      isEventFired = true;
      isTransitioning.current = false;
    };

    inner.addEventListener("transitionend", onTransitionEnd);
    return () => {
      inner.removeEventListener("transitionend", onTransitionEnd);
    };
  }, []);

  useEffect(() => {
    if (totalSlides <= 1) return;

    isTransitioning.current = true;
    const timeoutId = setTimeout(() => {
      isTransitioning.current = false;
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, totalSlides]);

  const slideClass = cn("w-full shrink-0", slotProps?.slide?.className);

  return (
    <div
      ref={rootRef}
      {...slotProps?.wrapper}
      className={cn(
        "relative overflow-hidden select-none",
        slotProps?.wrapper?.className
      )}
    >
      <div
        ref={innerRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((child, idx) => {
          const key = isValidElement(child) && child.key != null ? child.key : idx;
          return (
            <div key={key} {...slotProps?.slide} className={slideClass}>
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Carousel.displayName = "Carousel";
