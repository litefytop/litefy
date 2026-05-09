import { useState, createContext, useContext } from "react";
import { ClassNameValue, cn } from "@/lib";
import { CaretDownIcon, CaretRightIcon } from "./icons";

interface AccordionContextValue {
  openKeys: string[];
  allowMultiple: boolean;
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
  const { openKeys, onToggle } = useAccordionContext();
  const isOpen = openKeys.includes(value);

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)} {...props}>
      <button
        {...itemProps?.trigger}
        onClick={(e) => {
          itemProps?.trigger?.onClick?.(e);
          onToggle(value);
        }}
        className={cn("flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted  text-left", itemProps?.trigger?.className)}
      >
        <span {...itemProps?.label} className={cn("flex items-center gap-2", itemProps?.label?.className)}>
          {isOpen ? <CaretDownIcon /> : <CaretRightIcon />}
          {label}
        </span>
      </button>
      {isOpen && (
        <div {...itemProps?.content} className={cn("p-4 border-t bg-background", itemProps?.content?.className)}>
          {children}
        </div>
      )}
    </div>
  );
}

type AccordionProps = Omit<React.ComponentProps<"div">, "className"> & {
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
  const [internalOpenKeys, setInternalOpenKeys] = useState<string[]>(defaultOpenKeys);
  const isControlled = openKeys !== undefined;
  const currentOpenKeys = isControlled ? openKeys : internalOpenKeys;

  const handleToggle = (key: string) => {
    let newKeys: string[];

    if (currentOpenKeys.includes(key)) {
      newKeys = currentOpenKeys.filter((k) => k !== key);
    } else {
      if (allowMultiple) {
        newKeys = [...currentOpenKeys, key];
      } else {
        newKeys = [key];
      }
    }

    if (isControlled) {
      onOpenChange?.(newKeys);
    } else {
      setInternalOpenKeys(newKeys);
    }
  };

  return (
    <AccordionContext.Provider value={{ openKeys: currentOpenKeys, allowMultiple, onToggle: handleToggle }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
