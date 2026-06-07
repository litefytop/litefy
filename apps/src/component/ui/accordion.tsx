import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useId,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { ChevronDown } from "lucide-react";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

interface AccordionContextValue {
  openKeys: string[];
  onToggle: (key: string, currentOpenKeys: string[]) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

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
    [allowMultiple, isControlled, onOpenChange],
  );

  const contextValue = useMemo(
    () => ({
      openKeys: currentOpenKeys,
      onToggle,
    }),
    [currentOpenKeys, onToggle],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        {...props}
        className={cn(
          "flex flex-col inert:cursor-not-allowed inert:opacity-50 overflow-hidden",
          className,
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
    trigger?: HTMLAttrs<Omit<React.ComponentProps<"button">, "children">>;
  };
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  label: React.ReactNode | ((open: boolean) => React.ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function AccordionItem({
  value,
  slotProps,
  disabled,
  children,
  icon,
  label,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AccordionItemProps) {
  const context = useContext(AccordionContext);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const ownOpen = isControlled ? controlledOpen : internalOpen;
  const open = context ? context.openKeys.includes(value) : ownOpen;

  const handleToggle = () => {
    if (context) {
      context.onToggle(value, context.openKeys);
    } else {
      const newOpen = !ownOpen;
      if (!isControlled) setInternalOpen(newOpen);
      controlledOnOpenChange?.(newOpen);
    }
  };

  const internalId = useId();
  const panelId = slotProps?.content?.id ?? `${internalId}-panel`;
  const buttonId = slotProps?.trigger?.id ?? `${internalId}-button`;

  const renderIcon = () => {
    if (typeof icon === "function") return icon(open);
    if (icon) return icon;
    return (
      <ChevronDown
        data-open={open || undefined}
        className="size-4 transition-transform duration-300 data-open:-rotate-180"
        aria-hidden
      />
    );
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
        "overflow-hidden not-last:border-b",
        "inert:cursor-not-allowed inert:opacity-50",
        slotProps?.wrapper?.className,
      )}
    >
      <button
        {...slotProps?.trigger}
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          slotProps?.trigger?.onClick?.(e);
          handleToggle();
        }}
        disabled={disabled}
        className={cn(
          "flex justify-between items-center gap-2 w-full px-4 py-3 hover:underline cursor-pointer",
          slotProps?.trigger?.className,
        )}
      >
        {renderLabel()}
        {renderIcon()}
      </button>

      <div
        data-open={open || undefined}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[0fr]",
          "data-open:grid-rows-[1fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            {...slotProps?.content}
            className={cn(
              "bg-background p-4",
              slotProps?.content?.className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;
