"use client";
import * as React from "react";
import { type ClassNameValue, cn, Menu, PopoverContent } from "..";
import type { MenuConfig, MenuItemConfig } from "./menu";

export interface ContextMenuTriggerProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  disabled?: boolean;
  onOpenMenu?: (position: { x: number; y: number }) => void;
}

export function ContextMenuTrigger({
  disabled,
  onOpenMenu,
  onContextMenu,
  className,
  ...props
}: ContextMenuTriggerProps) {
  return (
    <div
      {...props}
      onContextMenu={(e) => {
        onContextMenu?.(e);
        if (e.defaultPrevented || disabled) return;
        e.preventDefault();
        onOpenMenu?.({ x: e.clientX, y: e.clientY });
      }}
      className={cn(className)}
    />
  );
}

export interface ContextMenuAnchorProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  position?: { x: number; y: number };
  anchorName: string;
}

export function ContextMenuAnchor({
  position,
  anchorName,
  className,
  style,
  ...props
}: ContextMenuAnchorProps) {
  return (
    <div
      {...props}
      aria-hidden
      className={cn("fixed size-0", className)}
      style={{ left: position?.x, top: position?.y, ...style, anchorName }}
    />
  );
}

export interface ContextMenuContentProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchorName: string;
  className?: ClassNameValue;
  style?: React.CSSProperties;
}

export function ContextMenuContent({
  open,
  onOpenChange,
  anchorName,
  className,
  style,
  ...props
}: ContextMenuContentProps) {
  return (
    <PopoverContent
      {...props}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("w-48", className)}
      style={{
        positionArea: "bottom right",
        justifySelf: "start",
        alignSelf: "start",
        positionTryFallbacks: "flip-block, flip-inline",
        margin: "4px 0 0 4px",
        ...style,
        positionAnchor: anchorName,
      }}
    />
  );
}

export interface ContextMenuProps {
  children: React.ReactNode;
  items: MenuConfig[];
  disabled?: boolean;
  onSelect?: (item: MenuItemConfig) => void;
  classNames?: {
    content?: ClassNameValue;
  };
  styles?: {
    content?: React.CSSProperties;
  };
}

export function ContextMenu({
  children,
  items,
  disabled,
  onSelect,
  classNames,
  styles,
}: ContextMenuProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const anchorName = `--context-menu-${uid}`;
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <>
      <ContextMenuTrigger
        disabled={disabled}
        onOpenMenu={(next) => {
          setPosition(next);
          setOpen(true);
        }}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuAnchor position={position} anchorName={anchorName} />
      <ContextMenuContent
        open={open}
        onOpenChange={setOpen}
        anchorName={anchorName}
        onContextMenu={(e) => e.preventDefault()}
        className={classNames?.content}
        style={styles?.content}
      >
        <Menu
          autoFocus={open}
          items={items}
          onSelect={(item) => {
            onSelect?.(item);
            setOpen(false);
          }}
          onEscape={() => setOpen(false)}
        />
      </ContextMenuContent>
    </>
  );
}

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Anchor = ContextMenuAnchor;
ContextMenu.Content = ContextMenuContent;
