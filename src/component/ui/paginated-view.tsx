"use client";

import { Children, isValidElement } from "react";
import { cn, ClassNameValue } from "@/lib";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type PaginatedViewProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  activeIndex: number;
  itemProps?: {
    slide?: WithDataAttributes<React.ComponentProps<"div">>;
  };
};

export function PaginatedView({
  children,
  activeIndex,
  itemProps,
  className,
  ...props
}: PaginatedViewProps) {
  const slides = Children.toArray(children).filter(isValidElement);
  const totalSlides = slides.length;
  const safeIndex = Math.max(0, Math.min(activeIndex, totalSlides - 1));

  const slide = itemProps?.slide ?? {};
  const slideWrapperProps = {
    ...slide,
    className: cn("w-full", slide.className),
  };

  return (
    <div {...props} className={cn(className)}>
      <div className="relative overflow-hidden">
        <div {...slideWrapperProps}>{slides[safeIndex]}</div>
      </div>
    </div>
  );
}
