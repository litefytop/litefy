import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useId,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { CaretDownIcon, CaretRightIcon } from "./icons";

interface AccordionContextValue {
  openKeys: string[];
  onToggle: (key: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion subcomponents must be used within Accordion");
  }
  return context;
}

type AccordionProps = React.ComponentProps<"div"> & {
  defaultOpenKeys?: string[];
  openKeys?: string[];
  onOpenChange?: (keys: string[]) => void;
  allowMultiple?: boolean;
  className?: ClassNameValue;
  children?: React.ReactNode;
};

export function Accordion({
  defaultOpenKeys = [],
  openKeys,
  onOpenChange,
  allowMultiple = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(() => {
    if (!allowMultiple && defaultOpenKeys.length > 0) {
      return [defaultOpenKeys[0]];
    }
    return allowMultiple ? defaultOpenKeys : [];
  });
  const isControlled = openKeys !== undefined;
  const currentOpenKeys = isControlled ? openKeys : internalOpenKeys;

  const onToggle = useCallback(
    (key: string) => {
      let next: string[];
      const isOpened = currentOpenKeys.includes(key);

      if (allowMultiple) {
        next = isOpened
          ? currentOpenKeys.filter((k) => k !== key)
          : [...currentOpenKeys, key];
      } else {
        next = isOpened ? [] : [key];
      }

      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setInternalOpenKeys(next);
      }
    },
    [currentOpenKeys, allowMultiple, isControlled, onOpenChange],
  );

  const contextValue = useMemo(
    () => ({
      openKeys: currentOpenKeys,
      onToggle,
    }),
    [currentOpenKeys, onToggle],
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = React.ComponentProps<"button"> & {
  value: string;
  label: React.ReactNode;
  className?: ClassNameValue;
  itemProps?: {
    root?: React.ComponentProps<"div">;
    label?: React.ComponentProps<"span">;
    content?: React.ComponentProps<"div">;
  };
};

function AccordionItem({
  value,
  label,
  className,
  itemProps,
  children,
  onClick,
  id,
  ...props
}: AccordionItemProps) {
  const { openKeys, onToggle } = useAccordionContext();
  const open = openKeys.includes(value);
  const internalId = useId();

  const panelId = itemProps?.content?.id ?? `${internalId}-panel`;
  const buttonId = id ?? `${internalId}-button`;
  return (
    <div
      {...itemProps?.root}
      className={cn(
        "border rounded-lg overflow-hidden",
        itemProps?.root?.className,
      )}
    >
      <button
        {...props}
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(e) => {
          onClick?.(e);
          onToggle(value);
        }}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted text-left",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        )}
      >
        <span
          {...itemProps?.label}
          className={cn("flex items-center gap-2", itemProps?.label?.className)}
        >
          {open ? <CaretDownIcon /> : <CaretRightIcon />}
          {label}
        </span>
      </button>
      {open && (
        <div
          {...itemProps?.content}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(
            "p-4 border-t bg-background",
            itemProps?.content?.className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Accordion.Item = AccordionItem;
