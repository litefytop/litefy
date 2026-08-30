"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export interface DropdownTriggerProps extends HTMLAttrs<React.ComponentProps<"button">> {
  className?: ClassNameValue;
}
export function DropdownTrigger({ className, ...props }: DropdownTriggerProps) {
  return <button {...props} type="button" aria-haspopup="menu" className={cn(className)} />;
}

export interface DropdownContentProps extends HTMLAttrs<React.ComponentProps<"div">> {
  className?: ClassNameValue;
}
export function DropdownContent({ className, ...props }: DropdownContentProps) {
  return (
    <div
      {...props}
      popover="manual"
      tabIndex={-1}
      className={cn(
        "bg-popover text-popover-foreground min-w-32 max-h-96 overflow-auto rounded-md border p-1 shadow-md list-none",
        className,
      )}
    />
  );
}

export interface DropdownSubContentProps extends DropdownContentProps {
  positionAnchor?: string;
}
export function DropdownSubContent({ positionAnchor, style, ...props }: DropdownSubContentProps) {
  return (
    <DropdownContent
      {...props}
      style={{
        margin: 0,
        positionAnchor,
        positionArea: "right span-bottom",
        justifySelf: "start",
        alignSelf: "start",
        positionTryFallbacks: "flip-inline, flip-block",
        ...style,
      }}
    />
  );
}

export interface DropdownItemProps extends HTMLAttrs<React.ComponentProps<"li">> {
  className?: ClassNameValue;
}
export function DropdownItem({ children, className, ...props }: DropdownItemProps) {
  return (
    <li className={cn("m-0 not-last:border-b", className)} {...props}>
      {children}
    </li>
  );
}

type DropdownGroup = {
  group: React.ReactNode;
  items: DropdownMenuItem[];
};

type DropdownMenuItem = {
  label: React.ReactNode;
  disabled?: boolean;
  className?: ClassNameValue;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: Omit<DropdownMenuItem, "children">[];
};

export type DropdownItemConfig = DropdownGroup | DropdownMenuItem;

type DropdownAlignX = "start" | "end" | "center";

const alignXMap: Record<
  DropdownAlignX,
  { positionArea: string; justifySelf: string; alignSelf: string; margin: string }
> = {
  start: {
    positionArea: "left span-bottom",
    justifySelf: "end",
    alignSelf: "start",
    margin: "0 4px 0 0",
  },
  center: {
    positionArea: "bottom span-all",
    justifySelf: "center",
    alignSelf: "start",
    margin: "4px 0 0",
  },
  end: {
    positionArea: "right span-bottom",
    justifySelf: "start",
    alignSelf: "start",
    margin: "0 0 0 4px",
  },
};

export interface DropdownProps extends Omit<DropdownContentProps, "className" | "style"> {
  itemClassName?: ClassNameValue;
  items?: DropdownItemConfig[];
  alignX?: DropdownAlignX;
  classNames?: {
    trigger?: ClassNameValue;
    content?: ClassNameValue;
  };
  styles?: {
    trigger?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

interface DropdownMenuProps {
  items: DropdownItemConfig[];
  uid: string;
  open?: boolean;
  autoFocus?: boolean;
  onSelect?: () => void;
  onEscape?: () => void;
  onArrowRight?: (entryId: string, item: DropdownMenuItem) => void;
  onArrowLeft?: () => void;
  onItemMouseEnter?: (entryId: string, item: DropdownMenuItem) => void;
  onItemMouseLeave?: () => void;
}

function DropdownMenu({
  items,
  uid,
  open,
  autoFocus,
  onSelect,
  onEscape,
  onArrowRight,
  onArrowLeft,
  onItemMouseEnter,
  onItemMouseLeave,
}: DropdownMenuProps) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const [activeEntry, setActiveEntry] = React.useState<string | null>(null);

  const entries = React.useMemo<{ entryId: string; item: DropdownMenuItem }[]>(() => {
    const list: { entryId: string; item: DropdownMenuItem }[] = [];
    items.forEach((item, idx) => {
      const itemUid = `${uid}-${idx}`;
      if ("items" in item) {
        item.items.forEach((mi, childIdx) => {
          list.push({ entryId: `${itemUid}-${childIdx}`, item: mi });
        });
      } else {
        list.push({ entryId: `${itemUid}-0`, item });
      }
    });
    return list;
  }, [items, uid]);

  const focusEntry = (entryId: string) => {
    const btn = listRef.current?.querySelector<HTMLButtonElement>(
      `li[data-entry="${entryId}"] > button`,
    );
    if (!btn) return;
    btn.focus();
    btn.scrollIntoView({ block: "nearest" });
  };

  const focusFirst = () => {
    const first = entries.find((en) => !en.item.disabled);
    if (first) {
      setActiveEntry(first.entryId);
      focusEntry(first.entryId);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setActiveEntry(null);
      return;
    }
    const frame = requestAnimationFrame(focusFirst);
    return () => cancelAnimationFrame(frame);
  }, [open, entries]);

  React.useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(focusFirst);
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  const renderItem = (mi: DropdownMenuItem, entryId: string) => {
    const hasSub = !!(mi.children && mi.children.length > 0);
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      mi.onClick?.(e);
      onSelect?.();
    };
    return (
      <DropdownItem
        key={entryId}
        data-entry={entryId}
        style={{ anchorName: `--dropdown-sub-${entryId}` }}
        onKeyDown={(e) => {
          const enabled = entries.filter((en) => !en.item.disabled);
          const idx = enabled.findIndex((en) => en.entryId === activeEntry);
          switch (e.key) {
            case "ArrowDown": {
              e.preventDefault();
              const next = enabled[idx + 1] ?? enabled[0];
              if (next) {
                setActiveEntry(next.entryId);
                focusEntry(next.entryId);
              }
              break;
            }
            case "ArrowUp": {
              e.preventDefault();
              const prev = enabled[idx - 1] ?? enabled[enabled.length - 1];
              if (prev) {
                setActiveEntry(prev.entryId);
                focusEntry(prev.entryId);
              }
              break;
            }
            case "ArrowRight": {
              const current = enabled[idx];
              if (!onArrowRight || !current) break;
              e.preventDefault();
              onArrowRight(current.entryId, current.item);
              break;
            }
            case "ArrowLeft": {
              if (!onArrowLeft) break;
              e.preventDefault();
              onArrowLeft();
              break;
            }
            case "Escape":
              e.preventDefault();
              onEscape?.();
              break;
          }
        }}
        onMouseEnter={() => {
          setActiveEntry(entryId);
          onItemMouseEnter?.(entryId, mi);
        }}
        onMouseLeave={onItemMouseLeave}
      >
        <button
          type="button"
          disabled={mi.disabled}
          className={cn(
            "w-full text-left px-2 py-1.5 text-sm font-semibold",
            hasSub && "flex items-center justify-between cursor-default",
            activeEntry === entryId && "bg-hover",
            mi.className,
          )}
          onClick={hasSub ? undefined : handleClick}
        >
          {mi.label}
          {hasSub && <span aria-hidden>›</span>}
        </button>
      </DropdownItem>
    );
  };

  const nodes: React.ReactNode[] = [];
  items.forEach((item, idx) => {
    const itemUid = `${uid}-${idx}`;
    if ("items" in item) {
      nodes.push(
        <DropdownItem
          key={`${itemUid}-label`}
          className="px-2 py-1.5 text-xs text-muted-foreground"
        >
          {item.group}
        </DropdownItem>,
      );
      item.items.forEach((mi, childIdx) => {
        nodes.push(renderItem(mi, `${itemUid}-${childIdx}`));
      });
    } else {
      nodes.push(renderItem(item, `${itemUid}-0`));
    }
  });

  return (
    <ul ref={listRef} className="m-0 list-none p-0">
      {nodes}
    </ul>
  );
}

export function Dropdown({
  items = [],
  alignX = "center",
  classNames,
  styles,
  children,
  ...props
}: DropdownProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const anchorName = `--dropdown-${id}`;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const rootPanelRef = React.useRef<HTMLDivElement>(null);
  const subPanelRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const [hoverSubItem, setHoverSubItem] = React.useState<DropdownMenuItem | null>(null);
  const [hoverAnchor, setHoverAnchor] = React.useState<string | null>(null);
  const [subAutoFocus, setSubAutoFocus] = React.useState(false);

  const timerRef = React.useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeSub = () => {
    setHoverSubItem(null);
    setHoverAnchor(null);
    setSubAutoFocus(false);
    clearTimer();
  };

  const closeAll = React.useCallback(() => {
    setOpen(false);
    setHoverSubItem(null);
    setHoverAnchor(null);
    setSubAutoFocus(false);
    clearTimer();
  }, []);

  React.useEffect(() => {
    const panel = rootPanelRef.current;
    if (!panel) return;
    if (open) {
      panel.showPopover();
    } else {
      panel.hidePopover();
    }
  }, [open]);

  React.useEffect(() => {
    const panel = subPanelRef.current;
    if (!panel) return;
    if (open && hoverSubItem && hoverAnchor) {
      panel.showPopover();
    } else {
      panel.hidePopover();
    }
  }, [open, hoverSubItem, hoverAnchor]);

  const handleTriggerClick = () => {
    setOpen(!open);
    setHoverSubItem(null);
    clearTimer();
  };

  React.useEffect(() => {
    if (!open) {
      setHoverSubItem(null);
      setHoverAnchor(null);
      clearTimer();
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (rootPanelRef.current?.contains(target)) return;
      if (subPanelRef.current?.contains(target)) return;
      closeAll();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closeAll]);

  const openSub = (entryId: string, item: DropdownMenuItem, focus: boolean) => {
    clearTimer();
    setHoverAnchor(`--dropdown-sub-${entryId}`);
    setHoverSubItem(item);
    setSubAutoFocus(focus);
  };

  const handleItemMouseEnter = (entryId: string, item: DropdownMenuItem) => {
    clearTimer();
    if (!item.children?.length) {
      timerRef.current = window.setTimeout(closeSub, 150);
      return;
    }
    openSub(entryId, item, false);
  };

  const handleItemMouseLeave = () => {
    clearTimer();
    timerRef.current = window.setTimeout(closeSub, 150);
  };

  const handleEscape = () => {
    closeAll();
    triggerRef.current?.focus();
  };

  const handleArrowLeft = () => {
    const parentEntry = hoverAnchor?.replace("--dropdown-sub-", "") ?? null;
    closeSub();
    if (!parentEntry) return;
    const btn = document.querySelector<HTMLButtonElement>(
      `li[data-entry="${parentEntry}"] > button`,
    );
    if (!btn) return;
    btn.focus();
    btn.scrollIntoView({ block: "nearest" });
  };

  return (
    <>
      <DropdownTrigger
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={classNames?.trigger}
        style={{ anchorName, ...styles?.trigger }}
      >
        {children}
      </DropdownTrigger>
      <DropdownContent
        ref={rootPanelRef}
        {...props}
        className={classNames?.content}
        style={{
          positionAnchor: anchorName,
          ...alignXMap[alignX],
          positionTryFallbacks: "flip-block, flip-inline",
          ...styles?.content,
        }}
      >
        <DropdownMenu
          open={open}
          items={items}
          uid={`${id}-root`}
          onSelect={closeAll}
          onEscape={handleEscape}
          onArrowRight={(entryId, item) => openSub(entryId, item, true)}
          onItemMouseEnter={handleItemMouseEnter}
          onItemMouseLeave={handleItemMouseLeave}
        />
      </DropdownContent>
      {open && hoverSubItem && hoverAnchor && !!hoverSubItem.children?.length && (
        <DropdownSubContent
          ref={subPanelRef}
          positionAnchor={hoverAnchor}
          onMouseEnter={clearTimer}
          onMouseLeave={handleItemMouseLeave}
        >
          <DropdownMenu
            autoFocus={subAutoFocus}
            items={hoverSubItem.children}
            uid={`${id}-sub`}
            onSelect={closeAll}
            onEscape={handleEscape}
            onArrowLeft={handleArrowLeft}
            onItemMouseEnter={clearTimer}
            onItemMouseLeave={handleItemMouseLeave}
          />
        </DropdownSubContent>
      )}
    </>
  );
}
