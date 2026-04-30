import { useState, createContext, useContext } from "react";
import { ClassNameValue, cn } from "@/lib";
import { CaretDownIcon, CaretRightIcon } from "./icons";

interface AccordionContextValue {
  openKeys: string[];
  allowMultiple: boolean;
  onToggle: (key: string) => void;
  itemProps?: {
    trigger?: React.ComponentProps<"button">;
    title?: React.ComponentProps<"span">;
    content?: React.ComponentProps<"div">;
  };
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
  title: React.ReactNode;
  className?: ClassNameValue;
  itemProps?: {
    trigger?: React.ComponentProps<"button">;
    title?: React.ComponentProps<"span">;
    content?: React.ComponentProps<"div">;
  };
};

function AccordionItem({
  value,
  title,
  className,
  itemProps: itemLevelProps,
  children,
  ...props
}: AccordionItemProps) {
  const { openKeys, onToggle, itemProps: contextItemProps } = useAccordionContext();
  const isOpen = openKeys.includes(value);

  // 合并配置：item 级别覆盖 context 级别
  const mergedItemProps = {
    trigger: { ...contextItemProps?.trigger, ...itemLevelProps?.trigger },
    title: { ...contextItemProps?.title, ...itemLevelProps?.title },
    content: { ...contextItemProps?.content, ...itemLevelProps?.content },
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)} {...props}>
      <button
        {...mergedItemProps.trigger}
        onClick={(e) => {
          mergedItemProps.trigger?.onClick?.(e);
          onToggle(value);
        }}
        className={cn("flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left", mergedItemProps.trigger?.className)}
      >
        <span {...mergedItemProps.title} className={cn("flex items-center gap-2", mergedItemProps.title?.className)}>
          {isOpen ? <CaretDownIcon /> : <CaretRightIcon />}
          {title}
        </span>
      </button>
      {isOpen && (
        <div {...mergedItemProps.content} className={cn("p-4 border-t bg-background", mergedItemProps.content?.className)}>
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
  itemProps?: {
    trigger?: React.ComponentProps<"button">;
    title?: React.ComponentProps<"span">;
    content?: React.ComponentProps<"div">;
  };
};

export function Accordion({
  defaultOpenKeys = [],
  openKeys,
  onOpenChange,
  allowMultiple = false,
  className,
  children,
  itemProps,
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
    <AccordionContext.Provider value={{ openKeys: currentOpenKeys, allowMultiple, onToggle: handleToggle, itemProps }}>
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
