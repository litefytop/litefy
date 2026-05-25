"use client";

import { Children, isValidElement } from "react";
import { cn, ClassNameValue } from "@/lib";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type CarouselProps = {
  children: React.ReactNode;
  activeIndex: number;
  performanceThreshold?: number; // 自动切换阈值
  className?: ClassNameValue;
  itemProps?: {
    root?: WithDataAttributes<React.ComponentProps<"div">>;
    slide?: WithDataAttributes<React.ComponentProps<"div">>;
  };
};

export function Carousel({
  children,
  activeIndex,
  performanceThreshold = 100, // 默认100页自动切性能模式
  className,
  itemProps,
}: CarouselProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const totalSlides = slides.length;

  if (totalSlides <= 1) return <>{children}</>;

  const safeIndex = Math.max(0, Math.min(activeIndex, totalSlides - 1));
  const enableAnimation = totalSlides <= performanceThreshold;

  // 高性能模式：只渲染当前页
  if (!enableAnimation) {
    return (
      <div {...itemProps?.root} className={cn(className, itemProps?.root?.className)}>
        <div className="relative overflow-hidden">
          {slides[safeIndex]}
        </div>
      </div>
    );
  }

  // 动画模式：全量渲染 + 平滑滑动
  return (
    <div {...itemProps?.root} className={cn(className, itemProps?.root?.className)}>
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((child, i) => (
            <div key={i} className="w-full shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
