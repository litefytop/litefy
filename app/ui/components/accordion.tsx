import { ChevronDown } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export interface AccordionRootProps extends Omit<
  React.ComponentProps<"div">,
  "className" | "defaultValue"
> {
  className?: ClassNameValue;
  disabled?: boolean;
}

export function AccordionRoot({ className, disabled, inert, ...props }: AccordionRootProps) {
  return (
    <div
      {...props}
      inert={disabled || inert}
      className={cn("flex flex-col inert:opacity-50 inert:cursor-not-allowed", className)}
    />
  );
}

export interface AccordionItemProps extends Omit<React.ComponentProps<"div">, "className"> {
  disabled?: boolean;
  className?: ClassNameValue;
}

export function AccordionItem({
  disabled,
  children,
  className,
  inert,
  ...props
}: AccordionItemProps) {
  return (
    <div
      {...props}
      inert={disabled || inert}
      className={cn("flex flex-col", "inert:cursor-not-allowed inert:opacity-50", className)}
    >
      {children}
    </div>
  );
}

export interface AccordionTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}

export function AccordionTrigger({
  children,
  className,
  onClick,
  ...props
}: AccordionTriggerProps) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "flex justify-between items-center border border-transparent cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export interface AccordionContentProps extends Omit<React.ComponentProps<"section">, "className"> {
  className?: ClassNameValue;
  open?: boolean;
}

export function AccordionContent({ children, className, open, ...props }: AccordionContentProps) {
  return (
    <section
      data-open={open}
      {...props}
      className={
        "grid transition-[grid-template-rows] duration-300 ease-in-out data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr]"
      }
    >
      <div className="overflow-hidden min-h-0">
        <div className={cn("min-h-0", className)}>{children}</div>
      </div>
    </section>
  );
}

interface MultipleAccordionProps extends AccordionRootProps {
  multiple: true;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  items: AccordionItemConfig[];
}

interface SingleAccordionProps extends AccordionRootProps {
  multiple?: false;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  items: AccordionItemConfig[];
}

export type AccordionProps = MultipleAccordionProps | SingleAccordionProps;

export interface AccordionItemConfig extends Omit<AccordionItemProps, "children"> {
  label: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  value: string;
  panel: React.ReactNode;
  slots?: {
    trigger?: HTMLAttrs<React.ComponentProps<"button">>;
    panel?: HTMLAttrs<React.ComponentProps<"section">>;
  };

}

export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  ...props
}: AccordionProps) {
  const [uncontrolledActiveKeys, setActiveKeys] = React.useState<string[]>(() => {
    if (multiple) {
      const v = defaultValue as string[] | undefined;
      return v ?? [];
    } else {
      const v = defaultValue as string | undefined;
      return v !== undefined ? [v] : [];
    }
  });
  const isControlled = value !== undefined;
  const activeKeys = isControlled
    ? multiple
      ? value
      : value
        ? [value]
        : []
    : uncontrolledActiveKeys;

  const handleClick = (cfg: AccordionItemConfig) => {
    setActiveKeys((prevKeys) => {
      const open = prevKeys.includes(cfg.value);
      let next: string[];

      if (multiple) {
        next = open ? prevKeys.filter((k) => k !== cfg.value) : [...prevKeys, cfg.value];
      } else {
        next = open ? [] : [cfg.value];
      }

      if (multiple) {
        (onValueChange as MultipleAccordionProps["onValueChange"])?.(next);
      } else {
        const out = next.length > 0 ? next[0] : undefined;
        (onValueChange as SingleAccordionProps["onValueChange"])?.(out);
      }

      return next;
    });
  };

  return (
    <AccordionRoot {...props} >
      {items.map((cfg) => {
        const panelId = `acc-panel-${cfg.value}`;
        const triggerId = `acc-trigger-${cfg.value}`;
        const open = activeKeys.includes(cfg.value);

        const labelNode = typeof cfg.label === "function" ? cfg.label(open) : cfg.label;
        const iconNode = typeof cfg.icon === "function" ? cfg.icon(open) : cfg.icon;

        return (
          <AccordionItem
            key={cfg.value}
            disabled={cfg.disabled}
            className={["not-last:border-b", cfg.className]}
          >
            <AccordionTrigger
              {...cfg.slots?.trigger}
              id={triggerId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => handleClick(cfg)}
              className={[
                "aria-[expanded=false]:hover:bg-hover p-4 text-sm font-medium ",
                cfg.slots?.trigger?.className,
              ]}
            >
              {labelNode}
              {iconNode ?? (
                <ChevronDown
                  data-open={open}
                  className="size-4 transition-transform duration-300 data-open:-rotate-180"
                  aria-hidden
                />
              )}
            </AccordionTrigger>
            <AccordionContent
              open={open}
              id={panelId}
              aria-labelledby={triggerId}
              {...cfg.slots?.panel}
              className={cn("p-4 pt-0 text-sm font-medium", cfg.slots?.panel?.className)}
            >
              {cfg.panel}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </AccordionRoot>
  );
}

Accordion.Root = AccordionRoot;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
