import * as React from "react";
import { cn } from "@/lib";

const TAB_SYMBOL = Symbol.for("__TAB__");

interface TabContextValue {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  idPrefix: string;
}

const TabContext = React.createContext<TabContextValue | null>(null);

export interface TabProps extends Omit<React.ComponentProps<"div">, "id"> {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

function hasSymbol(type: unknown, sym: symbol): boolean {
  if (typeof type !== "function") return false;
  return Object.getOwnPropertySymbols(type).includes(sym);
}

function findTabs(children: React.ReactNode) {
  const tabs: { value: string; label: React.ReactNode; disabled?: boolean }[] =
    [];
  const tabElements: React.ReactElement<TabProps>[] = [];

  const search = (node: React.ReactNode) => {
    if (!React.isValidElement(node)) return;
    const element = node as React.ReactElement<
      React.PropsWithChildren<TabProps>
    >;
    if (hasSymbol(element.type, TAB_SYMBOL)) {
      const { value, label, disabled } = element.props;
      if (value && label !== undefined) {
        tabs.push({ value, label, disabled });
        tabElements.push(element as React.ReactElement<TabProps>);
      }
      return;
    }
    if (element.props?.children) {
      React.Children.forEach(element.props.children, search);
    }
  };

  React.Children.forEach(children, search);
  return { tabs, tabElements };
}

export function Tab({ value, children, className, ...props }: TabProps) {
  const context = React.useContext(TabContext);
  if (!context) throw new Error("Tab must be used within Tabs");
  const isSelected = context.selectedValue === value;
  const panelId = `tab-panel-${context.idPrefix}-${value}`;
  const triggerId = `tab-trigger-${context.idPrefix}-${value}`;

  return (
    <div
      {...props}
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      data-state={isSelected ? "active" : "inactive"}
      className={cn(
        "w-full p-4 rounded-md bg-background hidden data-[state=active]:block",
        className,
      )}
    >
      {children}
    </div>
  );
}

Tab[TAB_SYMBOL] = true;

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "button" | "line";
  className?: string;
  children: React.ReactNode;
  slotProps?: {
    list?: React.ComponentProps<"div">;
    trigger?: React.ComponentProps<"button">;
  };
}

const tabClass = {
  button:
    "rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
  line: "bg-transparent text-muted-foreground hover:text-foreground group-data-[orientation=horizontal]:border-b-2 group-data-[orientation=vertical]:border-r-2 border-muted data-[state=active]:text-primary data-[state=active]:border-primary group-data-[orientation=vertical]:w-full",
};

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  orientation = "horizontal",
  variant = "line",
  className,
  children,
  slotProps,
}: TabsProps) {
  const idPrefix = React.useId();
  const { tabs, tabElements } = findTabs(children);

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? tabs[0]?.value,
  );
  const selectedValue = isControlled ? controlledValue : internalValue;

  const setSelectedValue = React.useCallback(
    (value: string) => {
      if (!isControlled) setInternalValue(value);
      onValueChange?.(value);
    },
    [isControlled, onValueChange],
  );

  const { children: listExtraChildren, ...listProps } = slotProps?.list ?? {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute("role") !== "tab") return;

    const availableTabs = tabs.filter((tab) => !tab.disabled);
    if (!availableTabs.length) return;

    const currentValue = target.getAttribute("data-value");
    const currentIndex = availableTabs.findIndex(
      (tab) => tab.value === currentValue,
    );
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      nextIndex = currentIndex - 1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      nextIndex = currentIndex + 1;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = availableTabs.length - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      nextIndex = (nextIndex + availableTabs.length) % availableTabs.length;
      const nextTab = availableTabs[nextIndex];
      const nextTriggerId = `tab-trigger-${idPrefix}-${nextTab.value}`;
      document.getElementById(nextTriggerId)?.focus();
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const value = target.getAttribute("data-value");
      if (value) setSelectedValue(value);
    }
  };

  const contextValue = React.useMemo(
    () => ({ selectedValue, setSelectedValue, idPrefix }),
    [selectedValue, setSelectedValue, idPrefix],
  );

  return (
    <TabContext.Provider value={contextValue}>
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
          {tabs.map((tab) => {
            const isActive = selectedValue === tab.value;
            const triggerId = `tab-trigger-${idPrefix}-${tab.value}`;
            const panelId = `tab-panel-${idPrefix}-${tab.value}`;
            return (
              <button
                key={tab.value}
                {...slotProps?.trigger}
                id={triggerId}
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                data-value={tab.value}
                data-state={isActive ? "active" : "inactive"}
                disabled={tab.disabled}
                onClick={(e) => {
                  if (!tab.disabled) setSelectedValue(tab.value);
                  slotProps?.trigger?.onClick?.(e);
                }}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                  tabClass[variant],
                  slotProps?.trigger?.className,
                )}
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
          {listExtraChildren}
        </div>
        {tabElements}
      </div>
    </TabContext.Provider>
  );
}
