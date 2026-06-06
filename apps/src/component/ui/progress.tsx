"use client";

import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";

export interface ProgressProps {
  value?: number;
  getCurrent?: () => number | Promise<number>;
  totalDuration?: number;
  checkpoints?: number[];
  reverse?: boolean;
  transitionDuration?: number;
  className?: string;
  barClassName?: string;
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
  barProps?: React.HTMLAttributes<HTMLDivElement>;
  onComplete?: () => void;
}

export function Progress({
  value: staticValue,
  getCurrent,
  totalDuration = 5,
  checkpoints = [0.25, 0.5, 0.75, 1],
  reverse = false,
  transitionDuration = 0.2,
  className,
  barClassName,
  rootProps,
  barProps,
  onComplete,
}: ProgressProps) {
  const [width, setWidth] = useState(0);
  const isDynamic = getCurrent !== undefined;
  const completedRef = useRef(false);
  const timerIdsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const updateWidth = (progress: number) => {
      const percent = Math.min(100, Math.max(0, progress * 100));
      setWidth(percent);
    };
    if (!isDynamic) {
      updateWidth(staticValue ?? 0);
      return;
    }

    let mounted = true;
    completedRef.current = false;
    timerIdsRef.current.forEach(clearTimeout);
    timerIdsRef.current = [];

    const start = async () => {
      let initial: number;
      try {
        initial = await getCurrent();
      } catch {
        initial = 0;
      }
      initial = Math.min(1, Math.max(0, initial));
      if (!mounted) return;
      updateWidth(initial);

      if (initial >= 1) {
        completedRef.current = true;
        onComplete?.();
        return;
      }

      for (let i = 0; i < checkpoints.length; i++) {
        const target = checkpoints[i];
        if (target <= initial) continue;
        const estimatedTime = totalDuration * target;
        const timer = setTimeout(async () => {
          if (completedRef.current || !mounted) return;
          let real: number;
          try {
            real = await getCurrent();
          } catch {
            real = initial;
          }
          real = Math.min(1, Math.max(0, real));
          if (!mounted) return;
          if (real >= 1) {
            updateWidth(1);
            completedRef.current = true;
            onComplete?.();
            return;
          }
          if (real > initial) {
            updateWidth(real);
            initial = real;
          }
        }, estimatedTime * 1000);
        timerIdsRef.current.push(timer);
      }
    };

    start();

    return () => {
      mounted = false;
      timerIdsRef.current.forEach(clearTimeout);
    };
  }, [
    isDynamic,
    getCurrent,
    totalDuration,
    checkpoints,
    onComplete,
    staticValue,
  ]);

  const barStyle = {
    width: `${width}%`,
    transition: `width ${transitionDuration}s ease-out`,
    ...barProps?.style,
  };

  return (
    <div
      {...rootProps}
      className={cn("h-1 bg-gray-200 rounded-full overflow-hidden", className)}
    >
      <div
        {...barProps}
        className={cn(
          "h-full rounded-full",
          reverse ? "bg-blue-500 float-right" : "bg-blue-500",
          barClassName,
        )}
        style={barStyle}
      />
    </div>
  );
}
