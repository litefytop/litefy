import { useState } from "react";
import { ClassNameValue, cn } from "@/lib";
import { ChevronDown, ChevronRight } from "lucide-react";

type AccordionProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  children?: React.ReactNode;
  disabled?: boolean;
};

export function Accordion({
  className,
  children,
  disabled,

  ...props
}: AccordionProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-2 inert:cursor-not-allowed inert:opacity-50",
        className,
      )}
      inert={disabled || props.inert}
    >
      {children}
    </div>
  );
}

type AccordionItemProps = React.ComponentProps<"details"> & {
  label: React.ReactNode;
  className?: ClassNameValue;
  itemProps?: {
    summary?: React.ComponentProps<"summary">;
    content?: React.ComponentProps<"div">;
  };
  icon?: React.ReactNode | ((open: boolean) => React.ReactNode);
  disabled?: boolean;
};

function AccordionItem({
  label,
  className,
  itemProps,
  children,
  icon: itemIcon,
  disabled,
  ...props
}: AccordionItemProps) {
  const [open, setOpen] = useState(false);

  const getIcon = () => {
    if (typeof itemIcon === "function") return itemIcon(open);
    return (
      itemIcon ||
      (open ? (
        <ChevronDown aria-hidden="true" />
      ) : (
        <ChevronRight aria-hidden="true" />
      ))
    );
  };

  return (
    <details
      {...props}
      inert={disabled || props.inert}
      onToggle={(event) => {
        setOpen(event.newState === "open");
      }}
      className={cn(
        "border rounded-lg overflow-hidden inert:cursor-not-allowed inert:opacity-50",
        className,
      )}
    >
      <summary
        {...itemProps?.summary}
        className={cn(
          "flex items-center  w-full px-4 py-3 bg-muted/50 hover:bg-muted text-left gap-2",
          itemProps?.summary?.className,
        )}
      >
        {getIcon()}
        {label}
      </summary>

      <div
        {...itemProps?.content}
        role="region"
        className={cn(
          "p-4 border-t bg-background",
          itemProps?.content?.className,
        )}
      >
        {children}
      </div>
    </details>
  );
}

Accordion.Item = AccordionItem;
