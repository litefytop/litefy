import { ChevronDown } from "lucide-react";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface CollapseRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  disabled?: boolean;
}

export function CollapseRoot({ className, disabled, inert, ...props }: CollapseRootProps) {
  return (
    <div
      {...props}
      inert={disabled || inert}
      className={cn("flex flex-col inert:opacity-50 inert:cursor-not-allowed", className)}
    />
  );
}

export interface CollapseItemProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  disabled?: boolean;
}

export function CollapseItem({
  className,
  disabled,
  children,
  inert,
  ...props
}: CollapseItemProps) {
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

export interface CollapseContentProps extends Omit<React.ComponentProps<"section">, "className"> {
  className?: ClassNameValue;
  open?: boolean;
}

interface CollapseContextValue {
  open: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
}

const CollapseContext = React.createContext<CollapseContextValue | null>(null);

export function CollapseTrigger({ children, className, onClick, ...props }: CollapseTriggerProps) {
  const ctx = React.useContext(CollapseContext);
  return (
    <button
      {...props}
      id={ctx?.triggerId ?? props.id}
      type="button"
      aria-expanded={ctx ? ctx.open : props["aria-expanded"]}
      aria-controls={ctx?.contentId ?? props["aria-controls"]}
      className={cn(
        "flex justify-between items-center border border-transparent cursor-pointer",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        ctx?.toggle();
      }}
    >
      {children}
    </button>
  );
}

export function CollapseContent({ children, className, open, ...props }: CollapseContentProps) {
  const ctx = React.useContext(CollapseContext);
  const isOpen = ctx ? ctx.open : (open ?? false);
  return (
    <section
      {...props}
      data-open={isOpen}
      id={ctx?.contentId ?? props.id}
      aria-labelledby={ctx?.triggerId ?? props["aria-labelledby"]}
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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Collapse({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: CollapseProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const id = React.useId();
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;

  const toggle = React.useCallback(() => {
    const next = !open;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  }, [open, isControlled, onOpenChange]);

  const context = React.useMemo(
    () => ({ open, toggle, triggerId, contentId }),
    [open, toggle, triggerId, contentId],
  );

  return (
    <CollapseContext.Provider value={context}>
      <CollapseRoot className={className} {...props}>
        {children}
      </CollapseRoot>
    </CollapseContext.Provider>
  );
}

export interface CollapseItemConfig extends Omit<CollapseItemProps, "children" | "content"> {
  value: string;
  label: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  content?: React.ReactNode;
  slots?: {
    trigger?: Omit<CollapseTriggerProps, "children">;
    content?: Omit<CollapseContentProps, "children">;
  };
}

interface BaseGroupProps extends CollapseRootProps {
  items: CollapseItemConfig[];
  itemClassName?: ClassNameValue;
  itemTriggerIcon?: React.ReactNode | ((open: boolean) => React.ReactNode);
}

interface AccordionGroupProps extends BaseGroupProps {
  accordion: true;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}

interface MultipleGroupProps extends BaseGroupProps {
  accordion?: false;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
}

export type CollapseGroupProps = AccordionGroupProps | MultipleGroupProps;

export function CollapseGroup({
  items,
  accordion = false,
  value,
  defaultValue,
  onValueChange,
  itemClassName,
  itemTriggerIcon,
  ...props
}: CollapseGroupProps) {
  const [uncontrolledOpenKeys, setOpenKeys] = React.useState<string[]>(() => {
    if (accordion) {
      const v = defaultValue as string | undefined;
      return v !== undefined ? [v] : [];
    }
    const v = defaultValue as string[] | undefined;
    return v ?? [];
  });
  const isControlled = value !== undefined;
  const openKeys = isControlled
    ? accordion
      ? value
        ? [value]
        : []
      : value
    : uncontrolledOpenKeys;

  const handleToggle = (cfg: CollapseItemConfig) => {
    setOpenKeys((prevKeys) => {
      const open = prevKeys.includes(cfg.value);
      const next = accordion
        ? open
          ? []
          : [cfg.value]
        : open
          ? prevKeys.filter((k) => k !== cfg.value)
          : [...prevKeys, cfg.value];

      if (accordion) {
        (onValueChange as AccordionGroupProps["onValueChange"])?.(
          next.length > 0 ? next[0] : undefined,
        );
      } else {
        (onValueChange as MultipleGroupProps["onValueChange"])?.(next);
      }

      return next;
    });
  };

  return (
    <CollapseRoot {...props}>
      {items.map((cfg) => {
        const open = openKeys.includes(cfg.value);
        const triggerId = `collapse-trigger-${cfg.value}`;
        const contentId = `collapse-content-${cfg.value}`;

        const labelNode = typeof cfg.label === "function" ? cfg.label(open) : cfg.label;
        const iconNode = cfg.icon ?? itemTriggerIcon;
        const icon =
          iconNode !== undefined
            ? typeof iconNode === "function"
              ? iconNode(open)
              : iconNode
            : undefined;

        return (
          <CollapseItem
            key={cfg.value}
            disabled={cfg.disabled}
            className={["not-last:border-b", cfg.className]}
          >
            <CollapseTrigger
              {...cfg.slots?.trigger}
              id={triggerId}
              aria-expanded={open}
              aria-controls={contentId}
              onClick={() => handleToggle(cfg)}
              className={[
                "aria-[expanded=false]:hover:bg-hover p-4 text-sm font-medium ",
                cfg.slots?.trigger?.className ?? itemClassName,
              ]}
            >
              {labelNode}
              {icon ?? (
                <ChevronDown
                  data-open={open}
                  className="size-4 transition-transform duration-300 data-[open=true]:-rotate-180"
                  aria-hidden
                />
              )}
            </CollapseTrigger>
            <CollapseContent
              open={open}
              id={contentId}
              aria-labelledby={triggerId}
              {...cfg.slots?.content}
              className={cn("p-4 pt-0 text-sm font-medium", cfg.slots?.content?.className)}
            >
              {cfg.content}
            </CollapseContent>
          </CollapseItem>
        );
      })}
    </CollapseRoot>
  );
}

Collapse.Root = CollapseRoot;
Collapse.Item = CollapseItem;
Collapse.Trigger = CollapseTrigger;
Collapse.Content = CollapseContent;
Collapse.Group = CollapseGroup;
