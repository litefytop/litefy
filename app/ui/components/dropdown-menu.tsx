"use client";

import * as React from "react";
import { Button, Menu, Popover, type MenuConfig, type MenuItemConfig, type ClassNameValue, cn } from "..";

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: MenuConfig[];
  onSelect?: (item: MenuItemConfig) => void;
  alignX?: "start" | "end" | "center";
  className?: ClassNameValue;
  classNames?: {
    content?: ClassNameValue;
    item?: ClassNameValue;
    label?: ClassNameValue;
    sub?: ClassNameValue;
  };
}

export function DropdownMenu({
  trigger,
  items,
  onSelect,
  alignX = "start",
  className,
  classNames,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      alignX={alignX}
      trigger={trigger}
      classNames={{
        trigger: cn(Button.className.base, Button.className.variant.primary, className),
        content: classNames?.content,
      }}
    >
      <Menu
        autoFocus={open}
        items={items}
        onSelect={(item) => {
          onSelect?.(item);
          setOpen(false);
        }}
        onEscape={() => setOpen(false)}
        classNames={{ item: classNames?.item, label: classNames?.label, sub: classNames?.sub }}
      />
    </Popover>
  );
}
