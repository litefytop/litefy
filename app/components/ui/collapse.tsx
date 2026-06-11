import { useState, useId, useCallback, createContext, useContext } from "react";
import { cn } from "@/lib";
import { ChevronDown } from "lucide-react";

interface CollapseContextValue {
  open: boolean;
  toggle: () => void;
  panelId: string;
  triggerId: string;
}

const CollapseContext = createContext<CollapseContextValue | null>(null);
function useCollapseContext() {
  const context = useContext(CollapseContext);
  if (!context)
    throw new Error("Collapse components must be used within Collapse");
  return context;
}
export interface CollapseProps extends Omit<React.ComponentProps<"div">, "id"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

export function Collapse({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...props
}: CollapseProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (disabled) return;
    if (!isControlled) {
      setInternalOpen((prev) => {
        const newState = !prev;
        onOpenChange?.(newState);
        return newState;
      });
    } else {
      onOpenChange?.(!open);
    }
  }, [disabled, isControlled, onOpenChange, open]);
  const idPrefix = useId();
  const panelId = `collapse-panel-${idPrefix}`;
  const triggerId = `collapse-trigger-${idPrefix}`;

  const ctx = { open, toggle, panelId, triggerId };

  return (
    <CollapseContext.Provider value={ctx}>
      <div
        {...props}
        inert={disabled || props.inert}
        className={cn("inert:opacity-50", className)}
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

export interface CollapseTriggerProps extends Omit<
  React.ComponentProps<"button">,
  "id" | "children"
> {
  children?: React.ReactNode;
}

export function CollapseTrigger({
  className,
  children,
  ...props
}: CollapseTriggerProps) {
  const { open, toggle, triggerId, panelId } = useCollapseContext();
  return (
    <button
      {...props}
      id={triggerId}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={toggle}
      className={cn(
        "flex items-center gap-2 hover:underline cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      type="button"
    >
      {children ?? (
        <ChevronDown
          data-open={open || undefined}
          className={cn(
            "size-4 transition-transform duration-300 data-open:rotate-180",
          )}
        />
      )}
    </button>
  );
}

export function CollapsePanel({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "id">) {
  const { open, panelId, triggerId } = useCollapseContext();
  return (
    <div
      {...props}
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      data-open={open || undefined}
      className={cn(
        "grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden",
        "grid-rows-[0fr]",
        "data-open:grid-rows-[1fr]",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

Collapse.Header = CollapseHeader;
Collapse.Trigger = CollapseTrigger;
Collapse.Panel = CollapsePanel;
