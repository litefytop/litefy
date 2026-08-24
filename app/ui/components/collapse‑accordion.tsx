import { ChevronDown } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface CollapseRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function CollapseRoot({ children, className, ...props }: CollapseRootProps) {
  return (
    <div
      {...props}
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
  slots?: {
    content?: CollapseRootProps;
  };
}

export function CollapsePanel({ children, className, open, slots, ...props }: CollapsePanelProps) {
  return (
    <section
      data-open={open}
      {...props}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr]",
        className,
      )}
    >
      <div className="overflow-hidden min-h-0">
        <div {...slots?.content} className={cn("min-h-0", slots?.content?.className)}>
          {children}
        </div>
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
    panel?: Omit<CollapsePanelProps, "children" | "slots">;
    trigger?: Omit<CollapseTriggerProps, "children">;
    content?: Omit<CollapseRootProps, "children">;
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
  const id = React.useId();
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
  const panelId = `acc-panel-${itemKey ?? id}`;
  const triggerId = `acc-trigger-${itemKey ?? id}`;
  const labelNode = typeof label === "function" ? label(open$) : label;
  const iconNode = typeof icon === "function" ? icon(open$) : icon;
  return (
    <CollapseRoot {...props} className={className}>
      <CollapseTrigger
        {...slots?.trigger}
        id={triggerId}
        aria-expanded={open$}
        aria-controls={panelId}
        onClick={(e) => {
          slots?.trigger?.onClick?.(e);
          handleToggle();
        }}
        className={[
          "aria-[expanded=false]:hover:bg-hover p-4 text-sm font-medium ",
          slots?.trigger?.className,
        ]}
      >
        {labelNode}
        {iconNode ?? (
          <ChevronDown
            data-open={open$}
            className="size-4 transition-transform duration-300 data-[open=true]:-rotate-180"
            aria-hidden
          />
        )}
      </CollapseTrigger>
      <CollapsePanel
        {...slots?.panel}
        open={open$}
        id={panelId}
        aria-labelledby={triggerId}
        className={slots?.panel?.className}
        slots={{
          content: {
            className: ["p-4 pt-0 text-sm font-medium", slots?.content?.className],
          },
        }}
      >
        {children}
      </CollapsePanel>
    </CollapseRoot>
  );
}

export interface CollapseItemConfig extends Omit<
  CollapseProps,
  "children" | "open" | "onOpenChange" | "itemKey"
> {
  panel: React.ReactNode;
  itemKey: string;
}

export interface AccordionRootProps extends CollapseRootProps {
  items: CollapseItemConfig[];
  itemClassName?: {
    root?: ClassNameValue;
    trigger?: ClassNameValue;
    panel?: ClassNameValue;
  };
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

export interface AccordionRootProps extends CollapseRootProps {
  items: CollapseItemConfig[];
  itemClassName?: {
    root?: ClassNameValue;
    trigger?: ClassNameValue;
    panel?: ClassNameValue;
  };
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
  activeKeys?: string | undefined;
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
      return (defaultActiveKeys as string[] | undefined) ?? [];
    }
    const val = defaultActiveKeys as string | undefined;
    return val ? [val] : [];
  });

  const isControlled = activeKeys !== undefined;

  let activeKeys$: string[];
  if (isControlled) {
    if (multiple) {
      activeKeys$ = activeKeys as string[];
    } else {
      const val = activeKeys as string | undefined;
      activeKeys$ = val ? [val] : [];
    }
  } else {
    activeKeys$ = _activeKeys;
  }

  const handleToggle = (itemKey: string) => {
    const isCurrentlyOpen = activeKeys$.includes(itemKey);
    let nextKeys: string[];

    if (multiple) {
      nextKeys = isCurrentlyOpen
        ? activeKeys$.filter((k) => k !== itemKey)
        : [...activeKeys$, itemKey];
    } else {
      nextKeys = isCurrentlyOpen ? [] : [itemKey];
    }

    if (!isControlled) {
      setActiveKeys(nextKeys);
    }

    if (multiple) {
      (onKeyChange as MultipleAccordionProps["onKeyChange"])?.(nextKeys);
    } else {
      (onKeyChange as SingleAccordionProps["onKeyChange"])?.(nextKeys[0] ?? "");
    }
  };

  return (
    <CollapseRoot {...props}>
      {items.map((cfg) => {
        return (
          <Collapse
            {...cfg}
            key={cfg.itemKey}
            className={cn("not-last:border-b", cfg.className, itemClassName?.root)}
            slots={{
              panel: {
                ...cfg.slots?.panel,
                className: [cfg.slots?.panel?.className, itemClassName?.panel],
              },
              trigger: {
                ...cfg.slots?.trigger,
                className: [cfg.slots?.trigger?.className, itemClassName?.trigger],
              },
              content: cfg.slots?.content,
            }}

            icon={cfg.icon ?? itemIcon}
            open={activeKeys$.includes(cfg.itemKey)}
            onOpenChange={() => handleToggle(cfg.itemKey)}
          >
            {cfg.panel}
          </Collapse>
        );
      })}
    </CollapseRoot>
  );
}
