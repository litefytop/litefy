"use client";

import { Children, isValidElement } from "react";
import { cn, ClassNameValue } from "@/lib";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type PaginatedViewProps = {
  children: React.ReactNode;
  activeIndex: number;
  performanceThreshold?: number;
  className?: ClassNameValue;
  itemProps?: {
    root?: WithDataAttributes<React.ComponentProps<"div">>;
    slide?: WithDataAttributes<React.ComponentProps<"div">>;
  };
};

export function PaginatedView({
  children,
  activeIndex,
  performanceThreshold = 100,
  className,
  itemProps,
}: PaginatedViewProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const totalSlides = slides.length;

  if (totalSlides <= 1) return <>{children}</>;

  const safeIndex = Math.max(0, Math.min(activeIndex, totalSlides - 1));
  const enableAnimation = totalSlides <= performanceThreshold;

  const slideWrapperProps = {
    ...itemProps?.slide,
    className: cn("w-full shrink-0", itemProps?.slide?.className),
  };

  if (!enableAnimation) {
    return (
      <div {...itemProps?.root} className={cn(className, itemProps?.root?.className)}>
        <div className="relative overflow-hidden">
          <div {...slideWrapperProps}>{slides[safeIndex]}</div>
        </div>
      </div>
    );
  }

  return (
    <div {...itemProps?.root} className={cn(className, itemProps?.root?.className)}>
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
