"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "..";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export interface MenuRootProps extends HTMLAttrs<React.ComponentProps<"ul">> {
  className?: ClassNameValue;
}
export function MenuRoot({ className, ...props }: MenuRootProps) {
  return <ul role="menu" {...props} className={cn("m-0 list-none p-0", className)} />;
}

export interface MenuItemProps extends HTMLAttrs<React.ComponentProps<"li">> {
  className?: ClassNameValue;
}
export function MenuItem({ className, ...props }: MenuItemProps) {
  return <li className={cn("m-0 not-last:border-b", className)} {...props} />;
}

export interface MenuLabelProps extends HTMLAttrs<React.ComponentProps<"li">> {
  className?: ClassNameValue;
}
export function MenuLabel({ className, ...props }: MenuLabelProps) {
  return (
    <li
      className={cn("m-0 not-last:border-b px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface MenuSubContentProps extends HTMLAttrs<React.ComponentProps<"div">> {
  positionAnchor?: string;
  className?: ClassNameValue;
}
export function MenuSubContent({
  positionAnchor,
  className,
  style,
  ...props
}: MenuSubContentProps) {
  return (
    <div
      {...props}
      popover="manual"
      tabIndex={-1}
      className={cn(
        "bg-background text-foreground w-3xs overflow-auto rounded-lg border p-1 shadow-md",
        className,
      )}
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

export type MenuItemConfig = {
  label: React.ReactNode;
  disabled?: boolean;
  className?: ClassNameValue;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: Omit<MenuItemConfig, "children">[];
};

export type MenuGroupConfig = {
  group: React.ReactNode;
  items: MenuItemConfig[];
};

export type MenuConfig = MenuGroupConfig | MenuItemConfig;

export interface MenuProps {
  items: MenuConfig[];
  autoFocus?: boolean;
  onSelect?: (item: MenuItemConfig) => void;
  onEscape?: () => void;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  itemClassName?: ClassNameValue;
  classNames?: {
    item?: ClassNameValue;
    label?: ClassNameValue;
    sub?: ClassNameValue;
  };
  styles?: {
    item?: React.CSSProperties;
    label?: React.CSSProperties;
    sub?: React.CSSProperties;
  };
}

interface MenuListProps {
  ref?: React.Ref<HTMLUListElement>;
  items: MenuConfig[];
  uid: string;
  autoFocus?: boolean;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  itemClassName?: ClassNameValue;
  classNames?: {
    item?: ClassNameValue;
    label?: ClassNameValue;
  };
  styles?: {
    item?: React.CSSProperties;
    label?: React.CSSProperties;
  };
  onSelect?: (item: MenuItemConfig) => void;
  onEscape?: () => void;
  onArrowRight?: (entryId: string, item: MenuItemConfig) => void;
  onArrowLeft?: () => void;
  onItemMouseEnter?: (entryId: string, item: MenuItemConfig) => void;
  onItemMouseLeave?: () => void;
}

function MenuList({
  ref,
  items,
  uid,
  autoFocus,
  className,
  style,
  itemClassName,
  classNames,
  styles,
  onSelect,
  onEscape,
  onArrowRight,
  onArrowLeft,
  onItemMouseEnter,
  onItemMouseLeave,
}: MenuListProps) {
  const listRef = React.useRef<HTMLUListElement>(null);
  const [activeEntry, setActiveEntry] = React.useState<string | null>(null);

  React.useImperativeHandle(ref, () => listRef.current as HTMLUListElement, []);

  const entries = React.useMemo<{ entryId: string; item: MenuItemConfig }[]>(() => {
    const list: { entryId: string; item: MenuItemConfig }[] = [];
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
    if (!autoFocus) return;
    const frame = requestAnimationFrame(focusFirst);
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  const renderItem = (mi: MenuItemConfig, entryId: string) => {
    const hasSub = !!(mi.children && mi.children.length > 0);
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      mi.onClick?.(e);
      onSelect?.(mi);
    };
    return (
      <MenuItem
        key={entryId}
        data-entry={entryId}
        className={classNames?.item}
        style={{ anchorName: `--menu-sub-${entryId}`, ...styles?.item }}
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
          role="menuitem"
          disabled={mi.disabled}
          aria-haspopup={hasSub ? "menu" : undefined}
          className={cn(
            "w-full text-left px-2 py-1.5 text-sm font-semibold cursor-pointer",
            "focus-visible:ring-inset",
            hasSub && "flex items-center justify-between cursor-default",
            activeEntry === entryId && "bg-hover",
            itemClassName,
            mi.className,
          )}
          onClick={hasSub ? undefined : handleClick}
        >
          {mi.label}
          {hasSub && <span aria-hidden>›</span>}
        </button>
      </MenuItem>
    );
  };

  const nodes: React.ReactNode[] = [];
  items.forEach((item, idx) => {
    const itemUid = `${uid}-${idx}`;
    if ("items" in item) {
      nodes.push(
        <MenuLabel key={`${itemUid}-label`} className={classNames?.label} style={styles?.label}>
          {item.group}
        </MenuLabel>,
      );
      item.items.forEach((mi, childIdx) => {
        nodes.push(renderItem(mi, `${itemUid}-${childIdx}`));
      });
    } else {
      nodes.push(renderItem(item, `${itemUid}-0`));
    }
  });

  return (
    <MenuRoot ref={listRef} className={className} style={style}>
      {nodes}
    </MenuRoot>
  );
}

export function Menu({
  items,
  autoFocus,
  onSelect,
  onEscape,
  className,
  style,
  itemClassName,
  classNames,
  styles,
}: MenuProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const rootPanelRef = React.useRef<HTMLUListElement>(null);
  const subPanelRef = React.useRef<HTMLDivElement>(null);
  const [hoverSubItem, setHoverSubItem] = React.useState<MenuItemConfig | null>(null);
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

  React.useEffect(() => {
    const panel = subPanelRef.current;
    if (!panel) return;
    if (hoverSubItem && hoverAnchor) {
      panel.showPopover();
    } else {
      panel.hidePopover();
    }
  }, [hoverSubItem, hoverAnchor]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (rootPanelRef.current?.contains(target)) return;
      if (subPanelRef.current?.contains(target)) return;
      closeSub();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => () => clearTimer(), []);

  const openSub = (entryId: string, item: MenuItemConfig, focus: boolean) => {
    clearTimer();
    setHoverAnchor(`--menu-sub-${entryId}`);
    setHoverSubItem(item);
    setSubAutoFocus(focus);
  };

  const handleItemMouseEnter = (entryId: string, item: MenuItemConfig) => {
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
    closeSub();
    onEscape?.();
  };

  const handleArrowLeft = () => {
    const parentEntry = hoverAnchor?.replace("--menu-sub-", "") ?? null;
    closeSub();
    if (!parentEntry) return;
    const btn = document.querySelector<HTMLButtonElement>(
      `li[data-entry="${parentEntry}"] > button`,
    );
    if (!btn) return;
    btn.focus();
    btn.scrollIntoView({ block: "nearest" });
  };

  const handleSelect = onSelect
    ? (item: MenuItemConfig) => {
        closeSub();
        onSelect(item);
      }
    : undefined;

  return (
    <>
      <MenuList
        ref={rootPanelRef}
        items={items}
        uid={`${id}-root`}
        autoFocus={autoFocus}
        className={cn(className)}
        style={style}
        itemClassName={itemClassName}
        classNames={{ item: classNames?.item, label: classNames?.label }}
        styles={{ item: styles?.item, label: styles?.label }}
        onSelect={handleSelect}
        onEscape={handleEscape}
        onArrowRight={(entryId, item) => openSub(entryId, item, true)}
        onItemMouseEnter={handleItemMouseEnter}
        onItemMouseLeave={handleItemMouseLeave}
      />
      {hoverSubItem && hoverAnchor && !!hoverSubItem.children?.length && (
        <MenuSubContent
          ref={subPanelRef}
          positionAnchor={hoverAnchor}
          onMouseEnter={clearTimer}
          onMouseLeave={handleItemMouseLeave}
          className={classNames?.sub}
          style={styles?.sub}
        >
          <MenuList
            autoFocus={subAutoFocus}
            items={hoverSubItem.children}
            uid={`${id}-sub`}
            itemClassName={itemClassName}
            classNames={{ item: classNames?.item, label: classNames?.label }}
            styles={{ item: styles?.item, label: styles?.label }}
            onSelect={handleSelect}
            onEscape={handleEscape}
            onArrowLeft={handleArrowLeft}
            onItemMouseEnter={clearTimer}
            onItemMouseLeave={handleItemMouseLeave}
          />
        </MenuSubContent>
      )}
    </>
  );
}
