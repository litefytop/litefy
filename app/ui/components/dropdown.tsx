"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface DropdownTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}
export function DropdownTrigger({ className, ...props }: DropdownTriggerProps) {
  return <button {...props} type="button" aria-haspopup="menu" className={cn(className)} />;
}

export interface DropdownContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function DropdownContent({ children, className, ...props }: DropdownContentProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export interface DropdownItemProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}
export function DropdownItem({ children, className, ...props }: DropdownItemProps) {
  return (
    <li className={cn("m-0", className)} {...props}>
      {children}
    </li>
  );
}

type DropdownGroupItem = {
  type: "group";
  label: React.ReactNode;
  children: DropdownMenuItem[];
};

type DropdownMenuItem = {
  label: React.ReactNode;
  disabled?: boolean;
  className?: ClassNameValue;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: Omit<DropdownMenuItem, "children">[];
};

export type DropdownItemConfig = DropdownGroupItem | DropdownMenuItem;
type DropdownAlignX = "start" | "end";

export interface DropdownProps extends Omit<DropdownContentProps, "children"> {
  itemClassName?: ClassNameValue;
  items?: DropdownItemConfig[];
  positionArea?: string;
  alignX?: DropdownAlignX;
  slots?: {
    trigger?: DropdownTriggerProps;
  };
}

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
  end: {
    positionArea: "right span-bottom",
    justifySelf: "start",
    alignSelf: "start",
    margin: "0 0 0 4px",
  },
};

export function Dropdown({
  itemClassName,
  items = [],
  positionArea = "bottom span-all",
  alignX,
  slots = {},
  className,
  style,
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
  const [highlightEntry, setHighlightEntry] = React.useState<string | null>(null);
  const [subHighlightEntry, setSubHighlightEntry] = React.useState<string | null>(null);

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
    setSubHighlightEntry(null);
    clearTimer();
  };

  const closeAll = React.useCallback(() => {
    setOpen(false);
    setHoverSubItem(null);
    setHoverAnchor(null);
    setHighlightEntry(null);
    setSubHighlightEntry(null);
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
      if (triggerRef.current?.contains(target)) return;
      if (rootPanelRef.current?.contains(target)) return;
      if (subPanelRef.current?.contains(target)) return;
      closeAll();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closeAll]);

  const handleItemMouseEnter = (entryId: string, item: DropdownMenuItem) => {
    clearTimer();
    if (!item.children?.length) {
      timerRef.current = window.setTimeout(closeSub, 150);
      return;
    }
    setHoverAnchor(`--dropdown-sub-${entryId}`);
    setHoverSubItem(item);
  };

  const handleItemMouseLeave = () => {
    clearTimer();
    timerRef.current = window.setTimeout(closeSub, 150);
  };

  const focusEntry = (panel: HTMLDivElement | null, entryId: string) => {
    const btn = panel?.querySelector<HTMLButtonElement>(`li[data-entry="${entryId}"] > button`);
    if (!btn) return;
    btn.focus();
    btn.scrollIntoView({ block: "nearest" });
  };

  const getRootEntries = () => {
    const entries: { entryId: string; item: DropdownMenuItem }[] = [];
    items.forEach((item, idx) => {
      const uid = `${id}-root-${idx}`;
      if ("type" in item && item.type === "group") {
        item.children.forEach((mi, childIdx) => {
          entries.push({ entryId: `${uid}-${childIdx}`, item: mi });
        });
      } else {
        entries.push({ entryId: `${uid}-0`, item });
      }
    });
    return entries;
  };

  React.useEffect(() => {
    if (!open) {
      setHighlightEntry(null);
      setSubHighlightEntry(null);
      return;
    }
    const first = getRootEntries().find((en) => !en.item.disabled);
    if (first) {
      setHighlightEntry(first.entryId);
      focusEntry(rootPanelRef.current, first.entryId);
    } else {
      rootPanelRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!subHighlightEntry) return;
    focusEntry(subPanelRef.current, subHighlightEntry);
  }, [subHighlightEntry]);

  const handleRootKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const entries = getRootEntries().filter((en) => !en.item.disabled);
    const idx = entries.findIndex((en) => en.entryId === highlightEntry);
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = entries[idx + 1] ?? entries[0];
        if (next) {
          setHighlightEntry(next.entryId);
          focusEntry(rootPanelRef.current, next.entryId);
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = entries[idx - 1] ?? entries[entries.length - 1];
        if (prev) {
          setHighlightEntry(prev.entryId);
          focusEntry(rootPanelRef.current, prev.entryId);
        }
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        const current = entries[idx];
        if (!current?.item.children?.length) break;
        setHoverAnchor(`--dropdown-sub-${current.entryId}`);
        setHoverSubItem(current.item);
        setSubHighlightEntry(`${id}-sub-0`);
        break;
      }
      case "Escape":
        e.preventDefault();
        closeAll();
        triggerRef.current?.focus();
        break;
    }
  };

  const handleSubKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hoverSubItem) return;
    const entries = (hoverSubItem.children ?? [])
      .map((_, i) => `${id}-sub-${i}`)
      .filter((_, i) => !hoverSubItem.children?.[i].disabled);
    const idx = entries.indexOf(subHighlightEntry ?? "");
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = entries[idx + 1] ?? entries[0];
        if (next) setSubHighlightEntry(next);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = entries[idx - 1] ?? entries[entries.length - 1];
        if (prev) setSubHighlightEntry(prev);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        const parentEntry = hoverAnchor?.replace("--dropdown-sub-", "") ?? null;
        closeSub();
        if (parentEntry) {
          setHighlightEntry(parentEntry);
          focusEntry(rootPanelRef.current, parentEntry);
        }
        break;
      }
      case "Escape":
        e.preventDefault();
        closeAll();
        triggerRef.current?.focus();
        break;
    }
  };

  const renderMenuItems = (
    list: DropdownMenuItem[],
    uid: string,
    activeId: string | null,
    onActive: (entryId: string) => void,
    inSubPanel: boolean,
  ) => {
    return list.map((mi, idx) => {
      const entryId = `${uid}-${idx}`;
      const itemAnchor = `--dropdown-sub-${entryId}`;
      const hasSub = !!(mi.children && mi.children.length > 0);
      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        mi.onClick?.(e);
        closeAll();
      };
      return (
        <DropdownItem
          key={entryId}
          data-entry={entryId}
          style={{ anchorName: itemAnchor }}
          className={cn("not-last:border-b")}
          onMouseEnter={() => {
            clearTimer();
            if (!inSubPanel) handleItemMouseEnter(entryId, mi);
            onActive(entryId);
          }}
          onMouseLeave={handleItemMouseLeave}
        >
          <button
            type="button"
            disabled={mi.disabled}
            className={cn(
              "w-full text-left px-2 py-1.5 text-sm font-semibold",
              hasSub && "flex items-center justify-between cursor-default",
              activeId === entryId && "bg-hover",
              itemClassName,
              mi.className,
            )}
            onClick={hasSub ? undefined : handleClick}
          >
            {mi.label}
            {hasSub && <span aria-hidden>›</span>}
          </button>
        </DropdownItem>
      );
    });
  };

  const renderRootItems = (list: DropdownItemConfig[]) => {
    const nodes: React.ReactNode[] = [];
    list.forEach((item, idx) => {
      const uid = `${id}-root-${idx}`;
      if ("type" in item && item.type === "group") {
        nodes.push(
          <DropdownItem
            key={`${uid}-label`}
            className={cn("px-2 py-1.5 text-xs text-muted-foreground")}
          >
            {item.label}
          </DropdownItem>,
        );
        nodes.push(
          ...renderMenuItems(item.children, uid, highlightEntry, setHighlightEntry, false),
        );
      } else {
        nodes.push(...renderMenuItems([item], uid, highlightEntry, setHighlightEntry, false));
      }
    });
    return nodes;
  };

  const renderSubPanel = () => {
    if (!open || !hoverSubItem || !hoverAnchor || !hoverSubItem.children) return null;
    return (
      <div
        ref={subPanelRef}
        popover="manual"
        tabIndex={-1}
        onKeyDown={handleSubKeyDown}
        className={cn(
          "bg-popover text-popover-foreground min-w-32 max-h-96 overflow-auto rounded-md border p-1 shadow-md list-none",
        )}
        style={{
          margin: 0,
          positionAnchor: hoverAnchor,
          positionArea: "right span-bottom",
          justifySelf: "start",
          alignSelf: "start",
          positionTryFallbacks: "flip-inline, flip-block",
        }}
        onMouseEnter={clearTimer}
        onMouseLeave={handleItemMouseLeave}
      >
        {renderMenuItems(
          hoverSubItem.children,
          `${id}-sub`,
          subHighlightEntry,
          setSubHighlightEntry,
          true,
        )}
      </div>
    );
  };

  return (
    <>
      <DropdownTrigger
        {...slots.trigger}
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={cn(slots.trigger?.className)}
        style={{ anchorName, ...slots.trigger?.style }}
      />
      <div
        ref={rootPanelRef}
        popover="manual"
        tabIndex={-1}
        onKeyDown={handleRootKeyDown}
        {...props}
        className={cn(
          "bg-popover text-popover-foreground min-w-32 max-h-96 overflow-auto rounded-md border p-1 shadow-md list-none",
          className,
        )}
        style={{
          positionAnchor: anchorName,
          ...(alignX
            ? alignXMap[alignX]
            : { margin: "4px 0 0", positionArea, justifySelf: "center" }),
          positionTryFallbacks: "flip-block, flip-inline",
          ...style,
        }}
      >
        {renderRootItems(items)}
      </div>
      {renderSubPanel()}
    </>
  );
}
