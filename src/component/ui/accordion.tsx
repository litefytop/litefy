import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useId,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { ChevronDown, ChevronUp } from "lucide-react";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

interface AccordionContextValue {
  openKeys: string[];
  onToggle: (key: string, currentOpenKeys: string[]) => void;
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
  disabled?: boolean;
};

export function Accordion({
  defaultOpenKeys = [],
  openKeys,
  onOpenChange,
  allowMultiple = false,
  className,
  children,
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
    [allowMultiple, isControlled, onOpenChange]
  );

  const contextValue = useMemo(
    () => ({
      openKeys: currentOpenKeys,
      onToggle,
    }),
    [currentOpenKeys, onToggle]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        {...props}
        className={cn(
          "flex flex-col gap-2 inert:cursor-not-allowed inert:opacity-50",
          className
        )}
        inert={disabled || props.inert}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = {
  value: string;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"div">>;
    content?: HTMLAttrs<React.ComponentProps<"div">>;
    trigger?: HTMLAttrs<
      Omit<React.ComponentProps<"button">, "children">
    >;
  };
  disabled?: boolean;
  children?: React.ReactNode;
 icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
    label: React.ReactNode | ((open: boolean) => React.ReactNode);
};

function AccordionItem({
  value,
  slotProps,
  disabled,
  children,
  icon,
  label,
}: AccordionItemProps) {
  const { openKeys, onToggle } = useAccordionContext();
  const open = openKeys.includes(value);
  const internalId = useId();

  const panelId = slotProps?.content?.id ?? `${internalId}-panel`;
  const buttonId = slotProps?.trigger?.id ?? `${internalId}-button`;

  const renderIcon = () => {
    if (typeof icon === "function") return icon(open);
    if (icon) return icon;
    return open ? <ChevronUp /> : <ChevronDown />;
  };

  const renderLabel = () => {
    if (typeof label === "function") return label(open);
    return label;
  };

  return (
    <div
      {...slotProps?.wrapper}
      inert={disabled || slotProps?.wrapper?.inert}
      className={cn(
        "border rounded-lg overflow-hidden",
        "inert:cursor-not-allowed inert:opacity-50",
        slotProps?.wrapper?.className
      )}
    >
      <button
        {...slotProps?.trigger}
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          slotProps?.trigger?.onClick?.(e);
          onToggle(value, openKeys);
        }}
        disabled={disabled}
        className={cn(
          "flex items-center justify-start gap-2 w-full px-4 py-3 bg-muted/50 hover:bg-muted text-left",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          slotProps?.trigger?.className
        )}
      >
        {renderIcon()}
        {renderLabel()}
      </button>
      {open && (
        <div
          {...slotProps?.content}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(
            "p-4 border-t bg-background",
            slotProps?.content?.className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Accordion.Item = AccordionItem;
