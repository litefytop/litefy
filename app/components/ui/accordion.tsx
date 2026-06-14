import { ChevronDown } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

interface AccordionContextValue {
  activeValues: string[];
  onToggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(
  null,
);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context)
    throw new Error("Accordion subcomponents must be used within Accordion");
  return context;
}

export interface AccordionProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: ClassNameValue;
}

export function Accordion({
  defaultValue = [],
  value: controlledValue,
  onValueChange,
  multiple = false,
  disabled,
  className,
  children,
  ...props
}: AccordionProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    () => {
      if (!multiple && defaultValue.length > 0) return [defaultValue[0]];
      return multiple ? defaultValue : [];
    },
  );

  const isControlled = controlledValue !== undefined;
  const activeValues = isControlled ? controlledValue : uncontrolledValue;

  const onToggle = React.useCallback(
    (value: string) => {
      let next: string[];
      const isOpened = activeValues.includes(value);
      if (multiple) {
        next = isOpened
          ? activeValues.filter((v) => v !== value)
          : [...activeValues, value];
      } else {
        next = isOpened ? [] : [value];
      }
      if (isControlled) {
        onValueChange?.(next);
      } else {
        setUncontrolledValue(next);
      }
    },
    [multiple, activeValues, isControlled, onValueChange],
  );

  const contextValue = React.useMemo(
    () => ({ activeValues, onToggle }),
    [activeValues, onToggle],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        {...props}
        inert={disabled}
        className={cn("flex flex-col inert:opacity-50", className)}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  label: React.ReactNode | ((open: boolean) => React.ReactNode);
  children?: React.ReactNode;
  slotProps?: {
    wrapper?: HTMLAttrs<React.ComponentProps<"div">>;
    content?: HTMLAttrs<React.ComponentProps<"section">>;
    trigger?: HTMLAttrs<React.ComponentProps<"button">>;
  };
}

function AccordionItem({
  value,
  disabled,
  icon,
  label,
  children,
  slotProps,
}: AccordionItemProps) {
  const { activeValues, onToggle } = useAccordionContext();
  const open = activeValues.includes(value);
  const fallbackId = React.useId();
  const panelId = slotProps?.content?.id ?? `accordion-panel-${fallbackId}`;
  const buttonId = slotProps?.trigger?.id ?? `accordion-trigger-${fallbackId}`;

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
        "flex flex-col",
        "not-last:border-b",
        "inert:cursor-not-allowed inert:opacity-50",
        slotProps?.wrapper?.className,
      )}
    >
      <button
        {...slotProps?.trigger}
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(value)}
        disabled={disabled}
        className={cn(
          "p-4 text-sm font-medium flex flex-1 justify-between items-center border border-transparent outline-none cursor-pointer",
          "hover:aria-[expanded=false]:bg-muted",
          slotProps?.trigger?.className,
        )}
        type="button"
      >
        {renderLabel()}
        {renderIcon()}
      </button>

      <div
        data-open={open || undefined}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[0fr]",
          "data-open:grid-rows-[1fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <section
            id={panelId}
            aria-labelledby={buttonId}
            {...slotProps?.content}
            className={cn(
              "p-4 pt-0 text-sm font-medium",
              slotProps?.content?.className,
            )}
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;
