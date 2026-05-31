"use client";

import { Children, isValidElement, useEffect, useRef, useCallback } from "react";
import { cn, ClassNameValue } from "@/lib";

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type CarouselProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  children: React.ReactNode;
  activeIndex: number;
  slotProps?: {
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
  className,
  ...props
}: CarouselProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const totalSlides = slides.length;
  const timerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);



  const safeIndex = Math.max(0, Math.min(activeIndex, totalSlides - 1));
  const slide = slotProps?.slide ?? {};
  const slideWrapperProps = {
    ...slide,
    className: cn("w-full shrink-0", slide.className),
  };

  const goNext = useCallback(() => {
    let nextIdx = safeIndex + 1;
    if (nextIdx >= totalSlides) {
      nextIdx = loop ? 0 : totalSlides - 1;
    }
    onChange?.(nextIdx);
  }, [safeIndex, totalSlides, loop, onChange]);

  // 自动播放 + 鼠标悬浮暂停
  useEffect(() => {
    const startTimer = () => {
      if (timerRef.current) return;
      timerRef.current = window.setInterval(goNext, autoPlayInterval);
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    if (autoPlay) {
      startTimer();
    } else {
      stopTimer();
    }

    const el = rootRef.current;
    if (el) {
      el.addEventListener("mouseenter", stopTimer);
      el.addEventListener("mouseleave", startTimer);
    }

    return () => {
      stopTimer();
      if (el) {
        el.removeEventListener("mouseenter", stopTimer);
        el.removeEventListener("mouseleave", startTimer);
      }
    };
  }, [autoPlay, autoPlayInterval, goNext]);

  return (
    <div ref={rootRef} {...props} className={cn(className)}>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((child, i) => (
            <div key={i} {...slideWrapperProps}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
