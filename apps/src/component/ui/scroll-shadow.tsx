import { cn, ClassNameValue } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type ScrollShadowProps = {
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  size?: string;
  className?: string;
  slotProps?: {
    shadow?: HTMLAttrs<React.ComponentProps<"div">>;
  };
};

export function ScrollShadow({
  children,
  position = "bottom",
  className,
  slotProps,
  size = "64px",
}: ScrollShadowProps) {
  const isVertical = position === "top" || position === "bottom";

  return (
    <div
      data-orientation={isVertical ? "vertical" : "horizontal"}
      className={cn(
        "relative overflow-hidden data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full",
        className,
      )}
    >
      <div className="size-full overflow-auto">
        {children}
        <div
          {...slotProps?.shadow}
          data-position={position}
          className={cn(
            "pointer-events-none absolute",
            "data-[position=top]:top-0 data-[position=top]:inset-x-0 data-[position=top]:bg-linear-to-b",
            "data-[position=bottom]:bottom-0 data-[position=bottom]:inset-x-0 data-[position=bottom]:bg-linear-to-t",
            "data-[position=left]:left-0 data-[position=left]:inset-y-0 data-[position=left]:bg-linear-to-r",
            "data-[position=right]:right-0 data-[position=right]:inset-y-0 data-[position=right]:bg-linear-to-l",
            "from-background to-transparent",
            slotProps?.shadow?.className,
          )}
          style={isVertical ? { height: size } : { width: size }}
        />
      </div>
    </div>
  );
}
