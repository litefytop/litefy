import { ChevronDown } from "lucide-react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import { cn } from "@/lib";

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
  onValueChange?: (open: boolean) => void;
  disabled?: boolean;
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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = useCallback(() => {
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
  const fallbackId = useId();
  let triggerId: string | undefined;
  let panelId: string | undefined;

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === CollapseTrigger) {
        const props = child.props as Partial<React.ComponentProps<"button">>;
        triggerId = props.id;
      }
      if (child.type === CollapsePanel) {
        const props = child.props as Partial<React.ComponentProps<"section">>;
        panelId = props.id;
      }
    }
  });
  const _panelId = panelId ?? `collapse-panel-${fallbackId}`;
  const _triggerId = triggerId ?? `collapse-trigger-${fallbackId}`;

  const ctx = { open, toggle, panelId: _panelId, triggerId: _triggerId };

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

export function CollapseTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
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
}: React.ComponentProps<"section">) {
  const { open, panelId, triggerId } = useCollapseContext();
  return (
    <section
      {...props}
      id={panelId}
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
    </section>
  );
}

Collapse.Header = CollapseHeader;
Collapse.Trigger = CollapseTrigger;
Collapse.Panel = CollapsePanel;
