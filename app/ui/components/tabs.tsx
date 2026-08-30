"use client";

import * as React from "react";
import { cn } from "@/lib";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: "horizontal" | "vertical";
  variant: "button" | "line";
  idPrefix: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
};

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "button" | "line";
  className?: string;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  variant = "line",
  className,
  children,
}: TabsProps) {
  const idPrefix = React.useId();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const selectedValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (!isControlled) setInternalValue(val);
      onValueChange?.(val);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo(
    () => ({
      value: selectedValue,
      onValueChange: handleValueChange,
      orientation,
      variant,
      idPrefix,
    }),
    [selectedValue, handleValueChange, orientation, variant, idPrefix]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "w-full font-sans flex  group",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          className
        )}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.ComponentProps<"div"> {
  autoScroll?: boolean;
}

export function TabsList({
  className,
  children,
  autoScroll = false,
  ...props
}: TabsListProps) {
  const { orientation, value } = useTabs();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    if (!listRef.current || !autoScroll) return;
    const el = listRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 3;
    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - threshold);
  }, [autoScroll]);

  React.useLayoutEffect(() => {
    if (!autoScroll || !listRef.current) return;
    const el = listRef.current;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    el.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateScrollState);
    };
  }, [autoScroll, updateScrollState]);

  React.useLayoutEffect(() => {
    if (!autoScroll || !listRef.current) return;
    const activeTrigger = listRef.current.querySelector<HTMLButtonElement>(
      `[data-state="active"]`
    );
    if (activeTrigger) {
      activeTrigger.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
  }, [value, autoScroll]);

  const handleScrollPrev = () => {
    if (!listRef.current) return;
    listRef.current.scrollBy({ left: -260, behavior: "smooth" });
  };

  const handleScrollNext = () => {
    if (!listRef.current) return;
    listRef.current.scrollBy({ left: 260, behavior: "smooth" });
  };

  const isHorizontal = orientation === "horizontal";

if (autoScroll && isHorizontal) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      <button
        type="button"
        onClick={handleScrollPrev}
        disabled={!canScrollLeft}
        aria-label="Scroll tabs left"
        className="size-8 flex items-center justify-center rounded-md hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed shrink-0"
      >
        <ChevronLeft className="size-4"/>
      </button>

      <div
        ref={listRef}
        role="tablist"
        className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden border-b border-border"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={handleScrollNext}
        disabled={!canScrollRight}
        aria-label="Scroll tabs right"
        className="size-8 flex items-center justify-center rounded-md hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed shrink-0"
      >
       <ChevronRight className="size-4"/>
      </button>
    </div>
  );
}

  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-2",
        isHorizontal ? "border-b border-border" : "flex-col border-r border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ComponentProps<"button"> {
  value: string;
  disabled?: boolean;
}

const triggerStyles = {
  button:
    "rounded-md text-muted-foreground hover:hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
  line: "bg-transparent text-muted-foreground hover:border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary",
};

export function TabsTrigger({
  value,
  disabled,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, variant, idPrefix } = useTabs();
  const isActive = selectedValue === value;
  const triggerId = `tab-trigger-${idPrefix}-${value}`;
  const panelId = `tab-panel-${idPrefix}-${value}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const tablist = el.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'));
    const currentIndex = tabs.indexOf(el);

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = tabs[(currentIndex + 1) % tabs.length];
      next?.focus();
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      prev?.focus();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) onValueChange(value);
    }
  };

  return (
    <button
      {...props}
      id={triggerId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      data-value={value}
      data-state={isActive ? "active" : "inactive"}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed",
        triggerStyles[variant],
        className
      )}
      type="button"
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.ComponentProps<"div"> {
  value: string;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: selectedValue, idPrefix } = useTabs();
  const isActive = selectedValue === value;

  if (!isActive) return null;

  const panelId = `tab-panel-${idPrefix}-${value}`;
  const triggerId = `tab-trigger-${idPrefix}-${value}`;

  return (
    <div
      {...props}
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      data-state="active"
      className={cn("w-full p-4 rounded-md bg-background", className)}
    >
      {children}
    </div>
  );
}
