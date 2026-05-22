import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useId,
  useRef,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AccordionContextValue {
  openKeys: string[];
  onToggle: (key: string, currentOpenKeys: string[]) => void;
  icon?: (open: boolean) => React.ReactNode;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion subcomponents must be used within Accordion");
  }
  return context;
}

type AccordionProps = React.ComponentProps<"div"> & {
  defaultOpenKeys?: string[];
  openKeys?: string[];
  onOpenChange?: (keys: string[]) => void;
  allowMultiple?: boolean;
  className?: ClassNameValue;
  children?: React.ReactNode;
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  disabled?: boolean;
};

export function AccordionControlled({
  defaultOpenKeys = [],
  openKeys,
  onOpenChange,
  allowMultiple = false,
  className,
  children,
  icon,
  disabled,
  ...props
}: AccordionProps) {
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(() => {
    if (!allowMultiple && defaultOpenKeys.length > 0) {
      return [defaultOpenKeys[0]];
    }
    return allowMultiple ? defaultOpenKeys : [];
  });
  const isControlled = openKeys !== undefined;
  const currentOpenKeys = isControlled ? openKeys : internalOpenKeys;
  const iconRef = useRef(icon);
  const getIcon = useCallback((open: boolean) => {
    const currentIcon = iconRef.current;
    if (typeof currentIcon === "function") return currentIcon(open);
    return currentIcon;
  }, []);
  const onToggle = useCallback(
    (key: string, currentOpenKeys: string[]) => {
      let next: string[];
      const isOpened = currentOpenKeys.includes(key);

      if (allowMultiple) {
        next = isOpened
          ? currentOpenKeys.filter((k) => k !== key)
          : [...currentOpenKeys, key];
      } else {
        next = isOpened ? [] : [key];
      }

      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setInternalOpenKeys(next);
      }
    },
    [allowMultiple, isControlled, onOpenChange],
  );

  const contextValue = useMemo(
    () => ({
      openKeys: currentOpenKeys,
      onToggle,
      icon: getIcon,
    }),
    [currentOpenKeys, onToggle, getIcon],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        {...props}
        className={cn(
          "flex flex-col gap-2 inert:cursor-not-allowed inert:opacity-50",
          className,
        )}
        inert={disabled || props.inert}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentProps<"button"> & {
  value: string;
  label: React.ReactNode;
  className?: ClassNameValue;
  itemProps?: {
    root?: React.ComponentProps<"div">;
    label?: React.ComponentProps<"span">;
    content?: React.ComponentProps<"div">;
  };
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  disabled?: boolean;
};

function AccordionItem({
  value,
  label,
  className,
  itemProps,
  children,
  onClick,
  id,
  icon: itemIcon,
  disabled,
  ...props
}: AccordionItemProps) {
  const { openKeys, onToggle, icon: contextIcon } = useAccordionContext();
  const open = openKeys.includes(value);
  const internalId = useId();
  const getIcon = () => {
    if (typeof itemIcon === "function") return itemIcon(open);
    return (
      itemIcon ||
      contextIcon?.(open) ||
      (open ? (
        <ChevronDown aria-hidden="true" />
      ) : (
        <ChevronRight aria-hidden="true" />
      ))
    );
  };
  const panelId = itemProps?.content?.id ?? `${internalId}-panel`;
  const buttonId = id ?? `${internalId}-button`;
  return (
    <div
      {...itemProps?.root}
      className={cn(
        "border rounded-lg overflow-hidden",
        itemProps?.root?.className,
      )}
    >
      <button
        {...props}
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          onClick?.(e);
          onToggle(value, openKeys);
        }}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted text-left",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
      >
        <span
          {...itemProps?.label}
          className={cn("flex items-center gap-2", itemProps?.label?.className)}
        >
          {getIcon()}
          {label}
        </span>
      </button>
      {open && (
        <div
          {...itemProps?.content}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(
            "p-4 border-t bg-background",
            itemProps?.content?.className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

AccordionControlled.Item = AccordionItem;
