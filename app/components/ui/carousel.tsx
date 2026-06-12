"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { cn, type ClassNameValue } from "@/lib";

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
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const dragStartTranslate = useRef(0);

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

  const goPrev = useCallback(() => {
    if (isTransitioning.current || totalSlides <= 1) return;
    const prevIdx = currentIndexRef.current - 1;
    const targetIdx = prevIdx < 0 ? (loop ? totalSlides - 1 : 0) : prevIdx;
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

  const startTimer = useCallback(() => {
    if (!autoPlay) return;
    clearTimer();
    timerRef.current = setInterval(goNext, safeInterval);
  }, [autoPlay, goNext, safeInterval, clearTimer]);

  useEffect(() => {
    if (totalSlides <= 1) {
      clearTimer();
      return;
    }
    if (autoPlay) startTimer();
    else clearTimer();

    const el = rootRef.current;
    if (!el) return;
    const onPause = clearTimer;
    const onResume = startTimer;
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
  }, [autoPlay, startTimer, clearTimer, totalSlides]);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    let eventFired = false;
    const onTransitionEnd = () => {
      if (eventFired) return;
      eventFired = true;
      isTransitioning.current = false;
    };
    inner.addEventListener("transitionend", onTransitionEnd);
    return () => inner.removeEventListener("transitionend", onTransitionEnd);
  }, []);

  useEffect(() => {
    if (totalSlides <= 1) return;
    isTransitioning.current = true;
    const timeoutId = setTimeout(() => {
      isTransitioning.current = false;
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [currentIndex, totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalSlides <= 1) return;
    clearTimer();
    const touch = e.touches[0];
    dragStartX.current = touch.clientX;
    dragCurrentX.current = touch.clientX;
    const currentTranslate = -currentIndexRef.current * 100;
    dragStartTranslate.current = currentTranslate;
    setIsDragging(true);
    if (innerRef.current) {
      innerRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    dragCurrentX.current = touch.clientX;
    const deltaX = dragCurrentX.current - dragStartX.current;
    const containerWidth = rootRef.current?.clientWidth || 1;
    const deltaPercent = (deltaX / containerWidth) * 100;
    let newTranslate = dragStartTranslate.current + deltaPercent;
    if (!loop && totalSlides > 1) {
      const minTranslate = -(totalSlides - 1) * 100;
      const maxTranslate = 0;
      newTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));
    }
    if (innerRef.current) {
      innerRef.current.style.transform = `translateX(${newTranslate}%)`;
    }
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const deltaX = dragCurrentX.current - dragStartX.current;
    const threshold = 50;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    } else {
      const targetTranslate = -currentIndexRef.current * 100;
      if (innerRef.current) {
        innerRef.current.style.transition = "transform 0.3s ease-out";
        innerRef.current.style.transform = `translateX(${targetTranslate}%)`;
      }
    }
    if (autoPlay) startTimer();
  };

  const slideClass = cn("w-full shrink-0", slotProps?.slide?.className);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      {...slotProps?.wrapper}
      className={cn(
        "overflow-hidden select-none",
        slotProps?.wrapper?.className
      )}
    >
      <div
        ref={innerRef}
        className="flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((child, idx) => {
          const key = isValidElement(child) && child.key != null ? child.key : idx;
          return (
            <div
              key={key}
              role="group"
              aria-roledescription="slide"
              {...slotProps?.slide}
              className={slideClass}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

