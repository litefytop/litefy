import { cn } from "@/lib";
import React, { useState, useCallback, useRef, KeyboardEvent } from "react";

export interface TabsProps<T extends string = string> {
  options: Array<{
    value: T;
    label: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
  }>;
  defaultValue?: T;
  value?: T;
  onValueChange?: (value: T) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "button" | "line";
  className?: string;
  itemProps?: {
    list?: React.ComponentProps<"div">;
    trigger?: React.ComponentProps<"button">;
    content?: React.ComponentProps<"div">;
  };
}

const tabClass = {
  button:
    "rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:shadow-sm",
  line: "bg-transparent text-muted-foreground hover:text-foreground group-data-[orientation=horizontal]:border-b-2 group-data-[orientation=vertical]:border-r-2 border-muted data-[selected=true]:text-primary data-[selected=true]:border-primary group-data-[orientation=vertical]:w-full",
};

export function Tabs<T extends string>({
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  variant = "line",
  className,
  itemProps,
}: TabsProps<T>) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? options[0]?.value,
  );
  const selectedValue = isControlled
    ? controlledValue
    : (uncontrolledValue ?? options[0]?.value);

  const handleSelect = useCallback(
    (newValue: T) => {
      if (!isControlled) setUncontrolledValue(newValue);
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  const listRef = useRef<HTMLDivElement>(null);
  const { children: listExtraChildren, ...listProps } = itemProps?.list ?? {};

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute("role") !== "tab") return;

    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ??
        [],
    ).filter((btn) => !btn.disabled);
    if (!triggers.length) return;

    const currentIndex = triggers.indexOf(target as HTMLButtonElement);
    let nextIndex: number | null = null;

    if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      nextIndex = currentIndex - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      nextIndex = currentIndex + 1;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = triggers.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      nextIndex = (nextIndex + triggers.length) % triggers.length;
      triggers[nextIndex].focus();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const value = target.getAttribute("data-value") as T;
      if (value) handleSelect(value);
    }
  };

  return (
    <div
      className={cn(
        "w-full font-sans flex gap-4 group",
        "data-[orientation=horizontal]:flex-col",
        "data-[orientation=vertical]:flex-row",
        className,
      )}
      data-orientation={orientation}
    >
      <div
        ref={listRef}
        {...listProps}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex items-center gap-2",
          "group-data-[orientation=horizontal]:border-b group-data-[orientation=horizontal]:border-border",
          "group-data-[orientation=vertical]:flex-col group-data-[orientation=vertical]:border-r group-data-[orientation=vertical]:border-border",
          listProps.className,
        )}
      >
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          const triggerId = `tab-trigger-${opt.value}`;
          const panelId = `tab-panel-${opt.value}`;

          return (
            <button
              key={opt.value}
              {...itemProps?.trigger}
              id={triggerId}
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              data-value={opt.value}
              data-selected={isSelected}
              disabled={opt.disabled}
              onClick={() => !opt.disabled && handleSelect(opt.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                tabClass[variant],
                itemProps?.trigger?.className,
              )}
              type="button"
              tabIndex={isSelected ? 0 : -1}
            >
              {opt.label}
            </button>
          );
        })}
        {listExtraChildren}
      </div>

      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        const panelId = `tab-panel-${opt.value}`;
        const triggerId = `tab-trigger-${opt.value}`;

        return (
          <div
            key={opt.value}
            {...itemProps?.content}
            id={panelId}
            role="tabpanel"
            aria-labelledby={triggerId}
            data-selected={isSelected}
            className={cn(
              "p-4 rounded-md bg-background data-[selected=false]:hidden",
              itemProps?.content?.className,
            )}
          >
            {opt.children}
          </div>
        );
      })}
    </div>
  );
}
