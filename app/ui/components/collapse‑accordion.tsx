import { ChevronDown } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface CollapseRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  disabled?: boolean;
  className?: ClassNameValue;
}

export function CollapseRoot({
  disabled,
  children,
  className,
  inert,
  ...props
}: CollapseRootProps) {
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

export interface CollapseTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}

export function CollapseTrigger({ children, className, onClick, ...props }: CollapseTriggerProps) {
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

export interface CollapseContentProps extends Omit<React.ComponentProps<"section">, "className"> {
  className?: ClassNameValue;
  open?: boolean;
}

export function CollapseContent({ children, className, open, ...props }: CollapseContentProps) {
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

export interface CollapseProps extends CollapseTriggerProps {
  label: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  open: boolean;
  value: string;
  panel: React.ReactNode;
  slots?: {
    root?: Omit<CollapseRootProps, "children">;
    panel?: Omit<CollapseContentProps, "children">;
  };
}

export function Collapse({
  slots,
  label,
  icon,
  open,
  children,
  className,
  ...props
}: CollapseProps) {
  const panelId = `acc-panel-${props.value}`;
  const triggerId = `acc-trigger-${props.value}`;

  const labelNode = typeof label === "function" ? label(open) : label;
  const iconNode = typeof icon === "function" ? icon(open) : icon;
  return (
    <CollapseRoot {...slots?.root} className={["not-last:border-b", slots?.root?.className]}>
      <CollapseTrigger
        {...props}
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        className={["aria-[expanded=false]:hover:bg-hover p-4 text-sm font-medium ", className]}
      >
        {labelNode}
        {iconNode ?? (
          <ChevronDown
            data-open={open}
            className="size-4 transition-transform duration-300 data-open:-rotate-180"
            aria-hidden
          />
        )}
      </CollapseTrigger>
      <CollapseContent
        open={open}
        id={panelId}
        aria-labelledby={triggerId}
        {...slots?.panel}
        className={cn("p-4 pt-0 text-sm font-medium", slots?.panel?.className)}
      >
        {children}
      </CollapseContent>
    </CollapseRoot>
  );
}

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

interface CollapseItemConfig extends Omit<CollapseProps, "children"> {
  panel: React.ReactNode;
}
interface MultipleAccordionProps extends AccordionRootProps {
  multiple: true;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  items: CollapseItemConfig[];
}

interface SingleAccordionProps extends AccordionRootProps {
  multiple?: false;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  items: CollapseItemConfig[];
}

export type AccordionProps = MultipleAccordionProps | SingleAccordionProps;
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

  const handleClick = (cfg: CollapseItemConfig) => {
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
    <AccordionRoot {...props}>
      {items.map((cfg) => {
        const open = activeKeys.includes(cfg.value);
        return <Collapse {...cfg} key={cfg.value} open={open} onClick={() => handleClick(cfg)} />;
      })}
    </AccordionRoot>
  );
}
