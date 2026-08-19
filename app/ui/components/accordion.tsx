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

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("Accordion subcomponents must be used within AccordionRoot");
  return context;
}

interface CommonAccordionProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  disabled?: boolean;
}

interface MultipleAccordionProps extends CommonAccordionProps {
  multiple: true;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
}

interface SingleAccordionProps extends CommonAccordionProps {
  multiple?: false;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}

export type AccordionRootProps = MultipleAccordionProps | SingleAccordionProps;

function normalize({ ...props }: AccordionRootProps): {
  multiple: boolean;
  defaultValue: string[];
  value: string[] | undefined;
  onValueChange: ((values: string[]) => void) | undefined;
} & CommonAccordionProps {
  if (props.multiple) {
    const { defaultValue: _defaultValue, value: _value, onValueChange: _onValueChange, multiple, ...rest } = props;
    return { multiple, defaultValue: _defaultValue ?? [], value: _value, onValueChange: _onValueChange, ...rest };
  } else {
    const { defaultValue: _defaultValue, value: _value, onValueChange: _onValueChange, ...rest } = props;
    return {
      multiple: false,
      defaultValue: _defaultValue !== undefined ? [_defaultValue] : [],
      value: _value !== undefined ? [_value] : undefined,
      onValueChange: _onValueChange
        ? (arr: string[]) => {
            const single = arr.length > 0 ? arr[0] : undefined;
            _onValueChange?.(single);
          }
        : undefined,
      ...rest,
    };
  }
}

export function AccordionRoot(props: AccordionRootProps) {
  const { multiple, defaultValue, value: controlledValue, onValueChange, disabled, inert, className, ...rest } = normalize(props);

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const onToggle = React.useCallback(
    (itemValue: string) => {
      const isOpened = value.includes(itemValue);
      const next = multiple ? (isOpened ? value.filter((v) => v !== itemValue) : [...value, itemValue]) : isOpened ? [] : [itemValue];
      if (isControlled) {
        onValueChange?.(next);
      } else {
        setUncontrolledValue(next);
      }
    },
    [multiple, value, isControlled, onValueChange],
  );

  const contextValue = React.useMemo(() => ({ activeValues: value, onToggle }), [value, onToggle]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div {...rest} inert={disabled || inert} className={cn("flex flex-col inert:opacity-50", className)} />
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: ClassNameValue;
  wrapperProps?: HTMLAttrs<React.ComponentProps<"div">>;
}

export function AccordionItem({ value, disabled, children, className, wrapperProps }: AccordionItemProps) {
  const { activeValues } = useAccordionContext();
  const open = activeValues.includes(value);
  return (
    <div
      {...wrapperProps}
      data-value={value}
      data-open={open}
      inert={disabled || wrapperProps?.inert}
      className={cn("flex flex-col not-last:border-b", disabled && "inert:cursor-not-allowed inert:opacity-50", wrapperProps?.className, className)}
    >
      {children}
    </div>
  );
}

export interface AccordionTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}

export function AccordionTrigger({ children, className, ...rest }: AccordionTriggerProps) {
  return (
    <button {...rest} type="button" className={cn("p-4 text-sm font-medium flex justify-between items-center border border-transparent cursor-pointer", className)}>
      {children}
    </button>
  );
}

export interface AccordionContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function AccordionContent({ children, className, ...rest }: AccordionContentProps) {
  return (
    <div {...rest} className={cn("grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[0fr] data-open:grid-rows-[1fr]", className)}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

type AccordionItemConfig = Omit<AccordionItemProps, "children"> & {
  label: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  content: React.ReactNode;
  triggerProps?: HTMLAttrs<React.ComponentProps<"button">>;
  contentInnerProps?: HTMLAttrs<React.ComponentProps<"section">>;
};

export type AccordionProps = AccordionRootProps & {
  items: AccordionItemConfig[];
};

interface ConfigAccordionItemProps {
  cfg: AccordionItemConfig;
  activeValues: string[];
  onToggle: (v: string) => void;
}

function ConfigAccordionItem({ cfg, activeValues, onToggle }: ConfigAccordionItemProps) {
  const open = activeValues.includes(cfg.value);
  const panelId = `acc-panel-${cfg.value}`;
  const triggerId = `acc-trigger-${cfg.value}`;

  const labelNode = typeof cfg.label === "function" ? cfg.label(open) : cfg.label;
  const iconNode = typeof cfg.icon === "function" ? cfg.icon(open) : cfg.icon;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onToggle(cfg.value);
    cfg.triggerProps?.onClick?.(e);
  };

  return (
    <AccordionItem key={cfg.value} value={cfg.value} disabled={cfg.disabled} wrapperProps={cfg.wrapperProps} className={cfg.className}>
      <AccordionTrigger {...cfg.triggerProps} id={triggerId} aria-expanded={open} aria-controls={panelId} onClick={handleClick}>
        {labelNode}
        {iconNode ?? <ChevronDown data-open={open} className="size-4 transition-transform duration-300 data-open:-rotate-180" aria-hidden />}
      </AccordionTrigger>
      <AccordionContent>
        <section id={panelId} aria-labelledby={triggerId} {...cfg.contentInnerProps} className={cn("p-4 pt-0 text-sm font-medium", cfg.contentInnerProps?.className)}>
          {cfg.content}
        </section>
      </AccordionContent>
    </AccordionItem>
  );
}

export function Accordion({ items, ...rootProps }: AccordionProps) {
  const { activeValues, onToggle } = useAccordionContext();
  return (
    <AccordionRoot {...rootProps}>
      {items.map((cfg) => (
        <ConfigAccordionItem key={cfg.value} cfg={cfg} activeValues={activeValues} onToggle={onToggle} />
      ))}
    </AccordionRoot>
  );
}

Accordion.Root = AccordionRoot;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
