"use client";

import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type ScrollShadowProps = {
  children: React.ReactNode;
  shadowEdges?: ("top" | "bottom" | "left" | "right")[];
  size?: string;
  className?: string;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"div">>;
    shadows?: Partial<
      Record<
        "top" | "bottom" | "left" | "right",
        HTMLAttrs<React.ComponentProps<"div">>
      >
    >;
  };
};

export function ScrollShadow({
  children,
  shadowEdges = ["bottom"],
  size = "64px",
  className,
  slotProps,
}: ScrollShadowProps) {
  return (
    <div
      {...slotProps?.wrapper}
      className={cn("relative overflow-hidden", className)}
    >
      <div className="size-full overflow-auto">{children}</div>

      {shadowEdges.includes("top") && (
        <div
          {...slotProps?.shadows?.top}
          data-position="top"
          className={cn(
            "pointer-events-none absolute top-0 inset-x-0 bg-linear-to-b from-background to-transparent",
            slotProps?.shadows?.top?.className,
          )}
          style={{ height: size }}
        />
      )}
      {shadowEdges.includes("bottom") && (
        <div
          {...slotProps?.shadows?.bottom}
          data-position="bottom"
          className={cn(
            "pointer-events-none absolute bottom-0 inset-x-0 bg-linear-to-t from-background to-transparent",
            slotProps?.shadows?.bottom?.className,
          )}
          style={{ height: size }}
        />
      )}
      {shadowEdges.includes("left") && (
        <div
          {...slotProps?.shadows?.left}
          data-position="left"
          className={cn(
            "pointer-events-none absolute left-0 inset-y-0 bg-linear-to-r from-background to-transparent",
            slotProps?.shadows?.left?.className,
          )}
          style={{ width: size }}
        />
      )}
      {shadowEdges.includes("right") && (
        <div
          {...slotProps?.shadows?.right}
          data-position="right"
          className={cn(
            "pointer-events-none absolute right-0 inset-y-0 bg-linear-to-l from-background to-transparent",
            slotProps?.shadows?.right?.className,
          )}
          style={{ width: size }}
        />
      )}
    </div>
  );
}
