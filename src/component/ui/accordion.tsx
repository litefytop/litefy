import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { ClassNameValue, cn } from "@/lib";
import { CaretDownIcon, CaretRightIcon } from "./icons";

interface AccordionContextValue {
  openKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
  register: (key: string) => void;
  unregister: (key: string) => void;
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
  defaultOpenKeys?: Record<string, boolean>;
  openKeys?: Record<string, boolean>;
  onOpenChange?: (keys: Record<string, boolean>) => void;
  allowMultiple?: boolean;
  className?: ClassNameValue;
  children?: React.ReactNode;
};

export function Accordion({
  defaultOpenKeys = {},
  openKeys,
  onOpenChange,
  allowMultiple = false,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalOpenKeys, setInternalOpenKeys] = useState<
    Record<string, boolean>
  >({
    ...defaultOpenKeys,
  });

  const isControlled = openKeys !== undefined;

  const currentOpenKeys = isControlled ? openKeys : internalOpenKeys;

  const register = useCallback(
    (key: string) => {
      if (isControlled) return;
      setInternalOpenKeys((prev) => ({
        ...prev,
        [key]: prev[key] ?? false,
      }));
    },
    [isControlled],
  );

  const unregister = useCallback(
    (key: string) => {
      if (isControlled) return;
      setInternalOpenKeys((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [isControlled],
  );

  const onToggle = useCallback(
    (key: string) => {
      let next: Record<string, boolean>;

      if (allowMultiple) {
        next = { ...currentOpenKeys, [key]: !currentOpenKeys[key] };
      } else {
        next = currentOpenKeys[key] ? {} : { [key]: true };
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
      register,
      unregister,
    }),
    [currentOpenKeys, onToggle, register, unregister],
  );
  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
type AccordionItemProps = Omit<React.ComponentProps<"div">, "className"> & {
  value: string;
  label: React.ReactNode;
  className?: ClassNameValue;
  itemProps?: {
    trigger?: React.ComponentProps<"button">;
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
  ...props
}: AccordionItemProps) {
  const { openKeys, onToggle, register, unregister } = useAccordionContext();

  useEffect(() => {
    register(value);
    return () => unregister(value);
  }, [value, register, unregister]);

  const open = openKeys[value];

  return (
    <div
      className={cn("border rounded-lg overflow-hidden", className)}
      {...props}
    >
      <button
        {...itemProps?.trigger}
        onClick={(e) => {
          itemProps?.trigger?.onClick?.(e);
          onToggle(value);
        }}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted text-left",
          itemProps?.trigger?.className,
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
