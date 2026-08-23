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

export interface CollapsePanelProps extends Omit<React.ComponentProps<"section">, "className"> {
  className?: ClassNameValue;
  open?: boolean;
}

export function CollapsePanel({ children, className, open, ...props }: CollapsePanelProps) {
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

export interface CollapseProps extends CollapseRootProps {
  label?: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  itemKey?: string;
  slots?: {
    panel?: Omit<CollapsePanelProps, "children">;
    trigger?: Omit<CollapseTriggerProps, "children">;
  };
}

export function Collapse({
  slots,
  label,
  icon,
  open,
  defaultOpen = false,
  children,
  className,
  itemKey,
  onOpenChange,
  ...props
}: CollapseProps) {
  const [_open, setOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const open$ = isControlled ? open : _open;
  const handleToggle = () => {
    const next = !open$;
    if (!isControlled) {
      setOpen(next);
    }
    onOpenChange?.(next);
  };
  const panelId = `acc-panel-${itemKey}`;
  const triggerId = `acc-trigger-${itemKey}`;
  const labelNode = typeof label === "function" ? label(open$) : label;
  const iconNode = typeof icon === "function" ? icon(open$) : icon;
  return (
    <CollapseRoot {...props} className={className}>
      <CollapseTrigger
        {...slots?.trigger}
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          slots?.trigger?.onClick?.(e);
          handleToggle();
        }}
        className={["aria-[expanded=false]:hover:bg-hover p-4 text-sm font-medium ", slots?.trigger?.className]}
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
      <CollapsePanel
        {...slots?.panel}
        open={open}
        id={panelId}
        aria-labelledby={triggerId}

        className={cn(["p-4 pt-0 text-sm font-medium", slots?.panel?.className])}
      >
        {children}
      </CollapsePanel>
    </CollapseRoot>
  );
}


export interface CollapseItemConfig extends Omit<CollapseProps, "children"|"open"|"onOpenChange"|"itemKey"> {
  panel: React.ReactNode;
  itemKey: string;
}

export interface AccordionRootProps extends CollapseRootProps {
  items: CollapseItemConfig[];
itemClassName?: {
  root?: ClassNameValue;
  trigger?: ClassNameValue;
  panel?: ClassNameValue;
}

  itemIcon?: React.ReactNode | ((open: boolean) => React.ReactNode);
}


export interface MultipleAccordionProps extends AccordionRootProps {
  multiple: true;
  defaultActiveKeys?: string[];
  activeKeys?: string[];
  onKeyChange?: (values: string[]) => void;

}

export interface SingleAccordionProps extends AccordionRootProps {
  multiple?: false;
  defaultActiveKeys?: string;
  activeKeys?: string;
  onKeyChange?: (value: string | undefined) => void;

}

export type AccordionProps = MultipleAccordionProps | SingleAccordionProps;
export function Accordion({
  items,
  multiple = false,
  activeKeys,
  defaultActiveKeys,
  onKeyChange,
  itemClassName,
  itemIcon,
  ...props
}: AccordionProps) {
  const [_activeKeys, setActiveKeys] = React.useState<string[]>(() => {
    if (multiple) {
      const v = defaultActiveKeys as string[] | undefined;
      return v ?? [];
    } else {
      const v = defaultActiveKeys as string | undefined;
      return v !== undefined ? [v] : [];
    }
  });
  const isControlled = activeKeys !== undefined;
  const activeKeys$ = isControlled
    ? multiple
      ? activeKeys
      : activeKeys
        ? [activeKeys]
        : []
    : _activeKeys;


  return (
    <CollapseRoot
      {...props}

    >
      {items.map((cfg) => {
        const open = activeKeys$.includes(cfg.itemKey);
        const onOpenChange = (open: boolean) => {
          setActiveKeys((prevKeys) => {

            let next: string[];

            if (multiple) {
              next = open ? prevKeys.filter((k) => k !== cfg.itemKey) : [...prevKeys, cfg.itemKey];
            } else {
              next = open ? [] : [cfg.itemKey];
            }

            if (multiple) {
              (onKeyChange as MultipleAccordionProps["onKeyChange"])?.(next);
            } else {
              const out = next.length > 0 ? next[0] : undefined;
              (onKeyChange as SingleAccordionProps["onKeyChange"])?.(out);
            }

            return next;
          });
        };
        return (
          <Collapse
            {...cfg}
            key={cfg.itemKey}
            className={["not-last:border-b", cfg.className , itemClassName?.root]}
            slots={{
              panel: {
                ...cfg?.slots?.panel,
                className: [cfg.slots?.panel?.className , itemClassName?.panel],
              },
              trigger: {
                ...cfg?.slots?.trigger,
                className: [cfg.slots?.trigger?.className , itemClassName?.trigger],
              },
            }}
            icon={cfg.icon ?? itemIcon}
            open={open}
            onOpenChange={onOpenChange}
          />
        );
      })}
    </CollapseRoot>
  );
}
