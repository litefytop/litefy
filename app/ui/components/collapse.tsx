import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib";

const TRIGGER_SYMBOL = Symbol.for("__COLLAPSE_TRIGGER__");
const PANEL_SYMBOL = Symbol.for("__COLLAPSE_PANEL__");

interface CollapseContextValue {
  open: boolean;
  toggle: () => void;
  panelId: string;
  triggerId: string;
}

const CollapseContext = React.createContext<CollapseContextValue | null>(null);
function useCollapseContext() {
  const context = React.useContext(CollapseContext);
  if (!context)
    throw new Error("Collapse components must be used within Collapse");
  return context;
}

export interface CollapseProps extends Omit<React.ComponentProps<"div">, "id"> {
  open?: boolean;
  defaultOpen?: boolean;
  onValueChange?: (open: boolean) => void;
  disabled?: boolean;
}

function hasSymbol(type: unknown, sym: symbol): boolean {
  if (typeof type !== "function") return false;
  return Object.getOwnPropertySymbols(type).includes(sym);
}

function findIds(children: React.ReactNode) {
  let triggerId: string | undefined;
  let panelId: string | undefined;

  const search = (node: React.ReactNode) => {
    if (triggerId && panelId) return;
    if (!React.isValidElement(node)) return;

    const element = node as React.ReactElement<{
      id?: string;
      children?: React.ReactNode;
    }>;

    const isTrigger = hasSymbol(element.type, TRIGGER_SYMBOL);
    const isPanel = hasSymbol(element.type, PANEL_SYMBOL);

    if (isTrigger) {
      triggerId = element.props.id;
    } else if (isPanel) {
      panelId = element.props.id;
    }

    if (element.props.children) {
      React.Children.forEach(element.props.children, search);
    }
  };

  React.Children.forEach(children, search);
  return { triggerId, panelId };
}

export function Collapse({
  open: controlledOpen,
  defaultOpen = false,
  onValueChange,
  disabled = false,
  className,
  children,
  ...props
}: CollapseProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = React.useCallback(() => {
    if (disabled) return;
    if (!isControlled) {
      setUncontrolledOpen((prev) => {
        const newState = !prev;
        onValueChange?.(newState);
        return newState;
      });
    } else {
      onValueChange?.(!open);
    }
  }, [disabled, isControlled, onValueChange, open]);

  const fallbackId = React.useId();
  const { triggerId: userTriggerId, panelId: userPanelId } = findIds(children);
  const triggerId = userTriggerId ?? `collapse-trigger-${fallbackId}`;
  const panelId = userPanelId ?? `collapse-panel-${fallbackId}`;

  const ctx = React.useMemo(
    () => ({ open, toggle, panelId, triggerId }),
    [open, toggle, panelId, triggerId],
  );

  return (
    <CollapseContext.Provider value={ctx}>
      <div
        {...props}
        inert={disabled || props.inert}
        className={cn(
          "flex flex-col",
          "not-last:border-b",
          "inert:cursor-not-allowed inert:opacity-50",
          className,
        )}
      >
        {children}
      </div>
    </CollapseContext.Provider>
  );
}

export function CollapseHeader({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "id">) {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-between w-full", className)}
    >
      {children}
    </div>
  );
}

export function CollapseTrigger({
  className,
  children,
  icon,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & {
  children?: React.ReactNode | ((open: boolean) => React.ReactNode);
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
}) {
  const { open, toggle, triggerId, panelId } = useCollapseContext();
  return (
    <button
      {...props}
      id={triggerId}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={toggle}
      data-has-child={children ? true : undefined}
      className={cn(
        "p-4 text-sm font-medium flex  justify-between items-center border border-transparent cursor-pointer",
        "hover:aria-[expanded=false]:bg-muted",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-has-child:flex-1",
        className,
      )}
      type="button"
    >
      {children && typeof children === "function" ? children(open) : children}
      {icon && typeof icon === "function"
        ? icon(open)
        : (icon ?? (
            <ChevronDown
              data-open={open || undefined}
              className={cn(
                "size-4 transition-transform duration-300 data-open:-rotate-180",
              )}
              aria-hidden
            />
          ))}
    </button>
  );
}

export function CollapseAction({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "p-4 text-sm font-medium flex justify-between items-center border border-transparent cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function CollapsePanel({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  const { open, panelId, triggerId } = useCollapseContext();
  return (
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
          {...props}
          id={panelId}
          aria-labelledby={triggerId}
          className={cn("p-4 pt-0 text-sm font-medium", className)}
        >
          {children}
        </section>
      </div>
    </div>
  );
}

CollapseTrigger[TRIGGER_SYMBOL] = true;
CollapsePanel[PANEL_SYMBOL] = true;

Collapse.Header = CollapseHeader;
Collapse.Trigger = CollapseTrigger;
Collapse.Panel = CollapsePanel;
Collapse.Action = CollapseAction;
