"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, type LucideIcon } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";

type Edge = "top" | "bottom" | "left" | "right";
type EdgesProp = Edge | Edge[];

export interface ScrollShadowRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ScrollShadowRoot({ className, ...props }: ScrollShadowRootProps) {
  return <div {...props} className={cn("relative overflow-hidden", className)} />;
}

export interface ScrollShadowViewportProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ScrollShadowViewport({ className, ...props }: ScrollShadowViewportProps) {
  return (
    <div
      tabIndex={0}
      {...props}
      className={cn("size-full overflow-auto overscroll-contain", className)}
    />
  );
}

export interface ScrollShadowEdgeProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  edge?: Edge;
  size?: string;
  arrow?: boolean;
}

const edgeClasses: Record<Edge, string> = {
  top: "top-0 inset-x-0 bg-linear-to-b from-background to-transparent",
  bottom: "bottom-0 inset-x-0 bg-linear-to-t from-background to-transparent",
  left: "left-0 inset-y-0 bg-linear-to-r from-background to-transparent",
  right: "right-0 inset-y-0 bg-linear-to-l from-background to-transparent",
};

const edgeArrow: Record<Edge, LucideIcon> = {
  top: ChevronUp,
  bottom: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
};

const arrowHit: Record<Edge, string> = {
  top: "top-0 inset-x-0 h-5",
  bottom: "bottom-0 inset-x-0 h-5",
  left: "left-0 inset-y-0 w-5",
  right: "right-0 inset-y-0 w-5",
};

export function ScrollShadowEdge({
  className,
  edge = "bottom",
  size = "64px",
  arrow = true,
  style,
  onClick,
  ...props
}: ScrollShadowEdgeProps) {
  const Icon = edgeArrow[edge];
  const interactive = typeof onClick === "function";
  const { "aria-label": ariaLabel, ...rest } = props;
  return (
    <div
      {...rest}
      data-position={edge}
      className={cn(
        "pointer-events-none absolute flex items-center justify-center text-muted-foreground",
        edgeClasses[edge],
        className,
      )}
      style={
        {
          [edge === "top" || edge === "bottom" ? "height" : "width"]: size,
          ...style,
        } as React.CSSProperties
      }
    >
      {arrow &&
        (interactive ? (
          <span
            role="button"
            aria-label={ariaLabel}
            onClick={onClick}
            className={cn(
              "pointer-events-auto absolute flex cursor-pointer select-none items-center justify-center transition-colors hover:text-foreground",
              arrowHit[edge],
            )}
          >
            <Icon className="size-4" />
          </span>
        ) : (
          <Icon className="size-4" />
        ))}
    </div>
  );
}

const normalizeEdges = (edges: EdgesProp = ["bottom"]): Edge[] => {
  return Array.isArray(edges) ? edges : [edges];
};

const initialVisibility: Record<Edge, boolean> = {
  top: false,
  bottom: false,
  left: false,
  right: false,
};

export interface ScrollShadowProps {
  children: React.ReactNode;
  edges?: EdgesProp;
  size?: string;
  arrow?: boolean;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: {
    viewport?: ClassNameValue;
    edge?: ClassNameValue;
  };
  styles?: {
    viewport?: React.CSSProperties;
    edge?: React.CSSProperties;
  };
}

export function ScrollShadow({
  children,
  edges: edgesProp = ["bottom"],
  size = "64px",
  arrow = true,
  onScroll,
  className,
  style,
  classNames,
  styles,
}: ScrollShadowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState<Record<Edge, boolean>>(initialVisibility);
  const edges = useMemo(() => normalizeEdges(edgesProp), [edgesProp]);

  const updateVisibility = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;

    const canScrollVertical = scrollHeight > clientHeight;
    const canScrollHorizontal = scrollWidth > clientWidth;

    const top = canScrollVertical && scrollTop > 0;
    const bottom = canScrollVertical && scrollTop + clientHeight < scrollHeight - 1;
    const left = canScrollHorizontal && scrollLeft > 0;
    const right = canScrollHorizontal && scrollLeft + clientWidth < scrollWidth - 1;

    setVisibility((prev) => {
      if (prev.top === top && prev.bottom === bottom && prev.left === left && prev.right === right) {
        return prev;
      }
      return { top, bottom, left, right };
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

  const scrollToEdge = useCallback((edge: Edge) => {
    const el = scrollRef.current;
    if (!el) return;
    if (edge === "top") el.scrollTo({ top: 0 });
    else if (edge === "bottom") el.scrollTo({ top: el.scrollHeight });
    else if (edge === "left") el.scrollTo({ left: 0 });
    else el.scrollTo({ left: el.scrollWidth });
  }, []);

  return (
    <ScrollShadowRoot className={className} style={style}>
      <ScrollShadowViewport
        ref={scrollRef}
        onScroll={onScroll}
        className={classNames?.viewport}
        style={styles?.viewport}
      >
        {children}
      </ScrollShadowViewport>
      {edges.map((edge) =>
        visibility[edge] ? (
          <ScrollShadowEdge
            key={edge}
            edge={edge}
            size={size}
            arrow={arrow}
            onClick={arrow ? () => scrollToEdge(edge) : undefined}
            aria-label={arrow ? `Scroll to ${edge}` : undefined}
            className={classNames?.edge}
            style={styles?.edge}
          />
        ) : null,
      )}
    </ScrollShadowRoot>
  );
}
