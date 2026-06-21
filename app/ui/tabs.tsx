"use client";

import * as React from "react";
import { cn } from "@/lib";

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
  if (!ctx)
    throw new Error("Tabs compound components must be used within <Tabs>");
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
    [isControlled, onValueChange],
  );

  const contextValue = React.useMemo(
    () => ({
      value: selectedValue,
      onValueChange: handleValueChange,
      orientation,
      variant,
      idPrefix,
    }),
    [selectedValue, handleValueChange, orientation, variant, idPrefix],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "w-full font-sans flex gap-4 group",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          className,
        )}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.ComponentProps<"div"> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const { orientation } = useTabs();

  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-2",
        orientation === "horizontal"
          ? "border-b border-border"
          : "flex-col border-r border-border",
        className,
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
    "rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
  line: "bg-transparent text-muted-foreground hover:text-foreground border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary",
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
        "px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        triggerStyles[variant],
        className,
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
