import { ChevronDown } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface CollapseRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function CollapseRoot({ children, className, ...props }: CollapseRootProps) {
  return (
    <div {...props} className={cn("flex flex-col not-last:border-b", className)}>
      {children}
    </div>
  );
}

export interface CollapseTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
  open?: boolean;
}

export function CollapseTrigger({
  children,
  className,
  open,
  onClick,
  ...props
}: CollapseTriggerProps) {
  return (
    <button
      {...props}
      type="button"
      aria-expanded={open}
      className={cn(
        "flex justify-between items-center cursor-pointer",
        "aria-[expanded=false]:hover:bg-hover p-3 text-sm font-medium",
        "focus-visible:ring-inset",
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
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out data-[open=false]:grid-rows-[0fr] data-[open=true]:grid-rows-[1fr]",
      )}
    >
      <div className="overflow-hidden min-h-0">
        <div className={cn("min-h-0 p-4 pt-0 text-sm font-medium", className)}>{children}</div>
      </div>
    </section>
  );
}

export interface CollapseProps extends Omit<CollapseRootProps, "className" | "style"> {
  label?: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  itemKey?: string;
  classNames?: {
    trigger?: ClassNameValue;
    panel?: ClassNameValue;
    root?: ClassNameValue;
  };
  styles?: {
    trigger?: React.CSSProperties;
    panel?: React.CSSProperties;
    root?: React.CSSProperties;
  };
}

export function Collapse({
  label,
  icon,
  open,
  defaultOpen = false,
  children,
  itemKey,
  onOpenChange,
  styles,
  classNames,
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
    <CollapseRoot {...props} className={classNames?.root} style={styles?.root}>
      <CollapseTrigger
        open={open$}
        id={triggerId}
        aria-controls={panelId}
        onClick={handleToggle}
        className={[classNames?.trigger]}
        style={styles?.trigger}
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
        open={open$}
        id={panelId}
        aria-labelledby={triggerId}
        className={classNames?.panel}
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
  common?: {
    classNames?: {
      root?: ClassNameValue;
      trigger?: ClassNameValue;
      panel?: ClassNameValue;
    };
    icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  };
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
  common,
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
            classNames={{
              root: cfg.classNames?.root ?? common?.classNames?.root,
              trigger: cfg.classNames?.trigger ?? common?.classNames?.trigger,
              panel: cfg.classNames?.panel ?? common?.classNames?.panel,
            }}

            icon={cfg.icon ?? common?.icon}
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
