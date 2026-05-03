import { ReactNode } from "react";

import { cn, ClassNameValue } from "@/lib";

import {
  createContext,
  useContext,
  ComponentProps,
  useState,
  useId,
} from "react";

const tabsClass = {
  base: "flex flex-col",
  list: "inline-flex items-center justify-center gap-1 p-1 bg-muted/10 rounded-md",
  trigger: "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
};

export type TabsContextProps = {
  value: string | undefined;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabsContext must be used within a Tabs component");
  }

  return context;
};

export type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: ClassNameValue;
  children?: ReactNode;
};

export function Tabs({
  defaultValue,
  value: controlledValue,
  children,
  onValueChange,
  className,
}: TabsProps) {
  const [value, setValueState] = useState<string | undefined>(() => {
    if (controlledValue !== undefined) {
      return controlledValue;
    }
    return defaultValue;
  });

  const setValue = (newValue: string) => {
    setValueState(newValue);
    onValueChange?.(newValue);
  };

  const contextValue = {
    value,
    setValue,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn(tabsClass.base, className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = {
  className?: ClassNameValue;
  children?: ReactNode;
} & ComponentProps<"div">;

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div {...props} className={cn(tabsClass.list, className)} role="tablist">
      {children}
    </div>
  );
}

export type TabsTriggerProps = {
  value: string;
  disabled?: boolean;
  className?: ClassNameValue;
  children?: ReactNode;
} & ComponentProps<"button">;

function TabsTrigger({
  value,
  disabled,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const id = useId();
  const { value: contextValue, setValue } = useTabsContext();
  const isActive = contextValue === value;

  const handleClick = () => {
    if (disabled) return;
    setValue(value);
  };

  return (
    <button
      {...props}
      id={props.id ?? id}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      className={cn(tabsClass.trigger, className)}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  );
}

export type TabsContentProps = {
  value: string;
  className?: ClassNameValue;
  children?: ReactNode;
} & ComponentProps<"div">;

function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: contextValue } = useTabsContext();
  const isActive = contextValue === value;

  if (!isActive) return null;

  return (
    <div
      {...props}
      id={`panel-${value}`}
      role="tabpanel"
      tabIndex={0}
      className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </div>
  );
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
