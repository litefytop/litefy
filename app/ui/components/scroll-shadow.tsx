"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

type Edge = "top" | "bottom" | "left" | "right";
type EdgesProp = Edge | Edge[];

export type ScrollShadowProps = {
  children: React.ReactNode;
  edges?: EdgesProp;
  size?: string;
  className?: string;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"div">>;
    shadows?: Partial<Record<Edge, HTMLAttrs<React.ComponentProps<"div">>>>;
  };
};

const normalizeEdges = (edges: EdgesProp = ["bottom"]): Edge[] => {
  return Array.isArray(edges) ? edges : [edges];
};

const initialVisibility: Record<Edge, boolean> = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};

export function ScrollShadow({
  children,
  edges: edgesProp = ["bottom"],
  size = "64px",
  className,
  slotProps,
}: ScrollShadowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] =
    useState<Record<Edge, boolean>>(initialVisibility);
  const edges = useMemo(() => normalizeEdges(edgesProp), [edgesProp]);

  const updateVisibility = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    } = el;

    const canScrollVertical = scrollHeight > clientHeight;
    const canScrollHorizontal = scrollWidth > clientWidth;

    setVisibility({
      top: canScrollVertical && scrollTop > 0,
      bottom: canScrollVertical && scrollTop + clientHeight < scrollHeight - 1,
      left: canScrollHorizontal && scrollLeft > 0,
      right: canScrollHorizontal && scrollLeft + clientWidth < scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateVisibility();

    el.addEventListener("scroll", updateVisibility, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateVisibility();
    });
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateVisibility);
      resizeObserver.disconnect();
    };
  }, [updateVisibility]);

  const edgeConfig = {
    top: {
      className:
        "top-0 inset-x-0 bg-linear-to-b from-background to-transparent",
      style: { height: size },
    },
    bottom: {
      className:
        "bottom-0 inset-x-0 bg-linear-to-t from-background to-transparent",
      style: { height: size },
    },
    left: {
      className:
        "left-0 inset-y-0 bg-linear-to-r from-background to-transparent",
      style: { width: size },
    },
    right: {
      className:
        "right-0 inset-y-0 bg-linear-to-l from-background to-transparent",
      style: { width: size },
    },
  };

  return (
    <div
      {...slotProps?.wrapper}
      className={cn("relative overflow-hidden", className)}
    >
      <div ref={scrollRef} className="size-full overflow-auto">
        {children}
      </div>

      {edges.map((edge) => {
        if (!visibility[edge]) return null;

        const config = edgeConfig[edge];
        const shadowProps = slotProps?.shadows?.[edge];

        return (
          <div
            key={edge}
            {...shadowProps}
            data-position={edge}
            className={cn(
              "pointer-events-none absolute",
              config.className,
              shadowProps?.className,
            )}
            style={{ ...config.style, ...shadowProps?.style }}
          />
        );
      })}
    </div>
  );
}
