"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsVariant = "button" | "line";

const triggerClassNames: Record<TabsVariant, string> = {
  button:
    "rounded-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
  line: "border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary",
};

export interface TabsListProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  orientation?: TabsOrientation;
  autoScroll?: boolean;
  activeValue?: string;
}

export function TabsList({
  className,
  children,
  orientation = "horizontal",
  autoScroll = false,
  activeValue,
  ...props
}: TabsListProps) {
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
    const activeTrigger = listRef.current.querySelector<HTMLButtonElement>(`[data-state="active"]`);
    if (activeTrigger) {
      activeTrigger.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
  }, [activeValue, autoScroll]);

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
          <ChevronLeft className="size-4" />
        </button>

        <div
          ref={listRef}
          role="tablist"
          aria-orientation={orientation}
          className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden border-b border-border"
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
          <ChevronRight className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...props}
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        "flex items-center gap-2",
        isHorizontal ? "border-b border-border" : "flex-col border-r border-border",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  value: string;
  active?: boolean;
  variant?: TabsVariant;
  onValueChange?: (value: string) => void;
  className?: ClassNameValue;
}

export function TabsTrigger({
  value,
  active = false,
  variant = "line",
  onValueChange,
  disabled,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const triggerId = `tabs-trigger-${value}`;
  const panelId = `tabs-panel-${value}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const el = e.currentTarget;
    const tablist = el.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(
      tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])'),
    );
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
      if (!disabled) onValueChange?.(value);
    }
  };

  return (
    <button
      {...props}
      type="button"
      id={triggerId}
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      data-value={value}
      data-state={active ? "active" : "inactive"}
      disabled={disabled}
      onClick={() => !disabled && onValueChange?.(value)}
      onKeyDown={handleKeyDown}
      className={cn("px-4 py-2 text-sm font-medium", triggerClassNames[variant], className)}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  value: string;
  active?: boolean;
  className?: ClassNameValue;
}

export function TabsContent({
  value,
  active = false,
  className,
  children,
  ...props
}: TabsContentProps) {
  if (!active) return null;

  return (
    <div
      {...props}
      id={`tabs-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`tabs-trigger-${value}`}
      data-state="active"
      className={cn("w-full p-4 rounded-md", className)}
    >
      {children}
    </div>
  );
}

export interface TabsOptionConfig {
  value: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.ComponentProps<"div">, "className"> {
  options: TabsOptionConfig[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  className?: ClassNameValue;
}

export function Tabs({
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  variant = "line",
  className,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolledValue;

  const handleValueChange = (val: string) => {
    if (!isControlled) setUncontrolledValue(val);
    onValueChange?.(val);
  };

  return (
    <div
      {...props}
      data-orientation={orientation}
      className={cn(
        "w-full font-sans flex group",
        orientation === "horizontal" ? "flex-col" : "flex-row",
        className,
      )}
    >
      <TabsList orientation={orientation} activeValue={selectedValue}>
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            active={selectedValue === option.value}
            disabled={option.disabled}
            variant={variant}
            onValueChange={handleValueChange}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {options.map((option) => (
        <TabsContent
          key={option.value}
          value={option.value}
          active={selectedValue === option.value}
        >
          {option.content}
        </TabsContent>
      ))}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
