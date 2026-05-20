import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useId,
  useEffect,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AccordionContextValue {
  openKeys: string[];
  onToggle: (key: string, isOpen: boolean) => void;
  allowMultiple: boolean;
  icon?: (open: boolean) => React.ReactNode;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion 必须在父组件内使用");
  }
  return context;
}

type AccordionProps = React.ComponentProps<"div"> & {
  defaultOpenKeys?: string[];
  openKeys?: string[];
  onOpenChange?: (keys: string[]) => void;
  allowMultiple?: boolean;
  className?: ClassNameValue;
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
};

export function Accordion({
  defaultOpenKeys = [],
  openKeys,
  onOpenChange,
  allowMultiple = false,
  className,
  icon,
  children,
  ...props
}: AccordionProps) {
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(
    allowMultiple ? defaultOpenKeys : defaultOpenKeys.slice(0, 1)
  );

  const isControlled = openKeys !== undefined;
  const currentOpenKeys = isControlled ? openKeys : internalOpenKeys;

  const onToggle = useCallback((key: string, isOpen: boolean) => {
    let nextKeys: string[];

    if (allowMultiple) {
      nextKeys = isOpen
        ? [...currentOpenKeys, key]
        : currentOpenKeys.filter(k => k !== key);
    } else {
      nextKeys = isOpen ? [key] : [];
    }

    if (isControlled) {
      onOpenChange?.(nextKeys);
    } else {
      setInternalOpenKeys(nextKeys);
    }
  }, [allowMultiple, currentOpenKeys, isControlled, onOpenChange]);

  const contextValue = useMemo(() => ({
    openKeys: currentOpenKeys,
    onToggle,
    allowMultiple,
    icon: typeof icon === "function" ? icon : undefined,
  }), [currentOpenKeys, onToggle, allowMultiple, icon]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentProps<"details"> & {
  value: string;
  label: React.ReactNode;
  className?: ClassNameValue;
  itemProps?: {
    root?: React.ComponentProps<"details">;
    label?: React.ComponentProps<"summary">;
    content?: React.ComponentProps<"div">;
  };
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
};

function AccordionItem({
  value,
  label,
  className,
  itemProps,
  children,
  icon: itemIcon,
}: AccordionItemProps) {
  const { openKeys, onToggle, allowMultiple, icon: contextIcon } = useAccordionContext();
  const id = useId();
  const panelId = `${id}-panel`;

  // 只读取状态，不控制
  const isOpen = openKeys.includes(value);

  // 只监听原生变化，同步出去 → 绝对不反向渲染造成循环
  const handleToggle = useCallback((e: React.ToggleEvent<HTMLDetailsElement>) => {
    // 阻止原生与 React 冲突
    e.preventDefault();
    onToggle(value, e.currentTarget.open);
  }, [onToggle, value]);

  // 非多开模式下，自动同步受控状态到原生
  useEffect(() => {
    const el = document.getElementById(panelId) as HTMLDetailsElement;
    if (!el) return;

    if (!allowMultiple) {
      el.open = isOpen;
    }
  }, [isOpen, allowMultiple, panelId]);

  const getIcon = () => {
    if (typeof itemIcon === "function") return itemIcon(isOpen);
    return (
      itemIcon ??
      contextIcon?.(isOpen) ??
      (isOpen ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />)
    );
  };

  return (
    <details
      {...itemProps?.root}
      id={panelId}
      onToggle={handleToggle}
      className={cn(
        "border rounded-lg overflow-hidden",
        itemProps?.root?.className
      )}
    >
      <summary
        {...itemProps?.label}
        className={cn(
          "flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted cursor-pointer list-none",
          className
        )}
      >
        <span className="flex items-center gap-2">
          {getIcon()}
          {label}
        </span>
      </summary>

      <div
        {...itemProps?.content}
        className={cn("p-4 border-t bg-background", itemProps?.content?.className)}
      >
        {children}
      </div>
    </details>
  );
}

Accordion.Item = AccordionItem;
