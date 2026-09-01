"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type ClassNameValue, cn } from "@/lib";

export interface BreadcrumbRootProps extends Omit<React.ComponentProps<"nav">, "className"> {
  className?: ClassNameValue;
}

export function BreadcrumbRoot({ className, ...props }: BreadcrumbRootProps) {
  return <nav aria-label="breadcrumb" {...props} className={cn("flex", className)} />;
}

export interface BreadcrumbListProps extends Omit<React.ComponentProps<"ol">, "className"> {
  className?: ClassNameValue;
}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      {...props}
      className={cn("flex min-w-0 flex-wrap items-center gap-1.5 text-sm", className)}
    />
  );
}

export interface BreadcrumbItemProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li {...props} className={cn("flex min-w-0 items-center", className)} />;
}

export interface BreadcrumbLinkProps extends Omit<React.ComponentProps<"a">, "className"> {
  className?: ClassNameValue;
}

export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      {...props}
      className={cn(
        "min-w-0 truncate rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    />
  );
}

export interface BreadcrumbPageProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      role="link"
      {...props}
      className={cn("min-w-0 truncate font-medium text-foreground", className)}
    />
  );
}

export interface BreadcrumbSeparatorProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}

export function BreadcrumbSeparator({ className, children, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      aria-hidden
      role="presentation"
      {...props}
      className={cn("flex items-center text-muted-foreground", className)}
    >
      {children ?? <ChevronRight className="size-3.5" />}
    </li>
  );
}

export interface BreadcrumbEntry {
  value: string;
  label: React.ReactNode;
  menu?: BreadcrumbEntry[];
}

export interface BreadcrumbProps {
  items: BreadcrumbEntry[];
  placeholder: React.ReactNode;
  onSelect?: (index: number, entry: BreadcrumbEntry) => void;
  className?: ClassNameValue;
  classNames?: {
    list?: ClassNameValue;
    link?: ClassNameValue;
    page?: ClassNameValue;
    separator?: ClassNameValue;
    placeholder?: ClassNameValue;
  };
}

export function Breadcrumb({
  items,
  placeholder,
  onSelect,
  className,
  classNames,
}: BreadcrumbProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);
  const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setOpenIndex(null);
    }, 120);
  };

  const handleMenuSelect = (index: number, entry: BreadcrumbEntry) => {
    cancelClose();
    setOpenIndex(null);
    triggerRefs.current[index]?.focus();
    onSelect?.(index, entry);
  };

  React.useEffect(() => {
    const panel = openIndex === null ? null : panelRefs.current[openIndex];
    if (!panel) return;
    if (!panel.matches(":popover-open")) panel.showPopover();
    return () => {
      if (panel.matches(":popover-open")) panel.hidePopover();
    };
  }, [openIndex]);

  React.useEffect(() => {
    if (openIndex === null) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRefs.current[openIndex]?.contains(target)) return;
      if (triggerRefs.current.some((el) => el?.contains(target))) return;
      setOpenIndex(null);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [openIndex]);

  const panels = items.map((entry, i) =>
    entry.menu ? (
      <div
        key={entry.value}
        ref={(el) => {
          panelRefs.current[i] = el;
        }}
        popover="manual"
        className="z-50 max-h-64 min-w-32 overflow-auto rounded-md border bg-background p-1 shadow-md"
        style={{
          positionAnchor: `--breadcrumb-${uid}-${i}`,
          positionArea: "bottom span-right",
          justifySelf: "start",
          alignSelf: "start",
          positionTryFallbacks: "flip-block, flip-inline",
          margin: "4px 0 0",
        }}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && panelRefs.current[i]?.contains(next)) return;
          if (next && triggerRefs.current[i]?.contains(next)) return;
          scheduleClose();
        }}
        onKeyDown={(e) => {
          const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            buttons[(index + 1 + buttons.length) % buttons.length]?.focus();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
          } else if (e.key === "Escape") {
            e.preventDefault();
            setOpenIndex(null);
            triggerRefs.current[i]?.focus();
          }
        }}
      >
        <ul role="menu" className="flex flex-col">
          {entry.menu.map((menuEntry) => (
            <li key={menuEntry.value} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMenuSelect(i + 1, menuEntry)}
                className="w-full cursor-pointer truncate rounded-sm px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                {menuEntry.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : null,
  );

  return (
    <>
      <BreadcrumbRoot className={className}>
        <BreadcrumbList className={classNames?.list}>
          {items.length === 0 ? (
            <BreadcrumbItem>
              <span className={cn("truncate text-muted-foreground", classNames?.placeholder)}>
                {placeholder}
              </span>
            </BreadcrumbItem>
          ) : (
            items.map((entry, i) => {
              const isLast = i === items.length - 1;
              return (
                <React.Fragment key={entry.value}>
                  <BreadcrumbItem>
                    {entry.menu ? (
                      <button
                        type="button"
                        ref={(el) => {
                          triggerRefs.current[i] = el;
                        }}
                        aria-haspopup="menu"
                        aria-expanded={openIndex === i}
                        onMouseEnter={() => {
                          cancelClose();
                          setOpenIndex(i);
                        }}
                        onMouseLeave={scheduleClose}
                        onFocus={() => {
                          cancelClose();
                          setOpenIndex(i);
                        }}
                        onBlur={(e) => {
                          const next = e.relatedTarget as Node | null;
                          if (next && panelRefs.current[i]?.contains(next)) return;
                          scheduleClose();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpenIndex(i);
                            panelRefs.current[i]
                              ?.querySelector<HTMLButtonElement>("button")
                              ?.focus();
                          }
                        }}
                        onClick={() => onSelect?.(i, entry)}
                        className={cn(
                          "flex cursor-pointer min-w-0 items-center gap-0.5 truncate rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          isLast ? "font-medium text-foreground" : "text-muted-foreground",
                          classNames?.link,
                        )}
                        style={{ anchorName: `--breadcrumb-${uid}-${i}` } as React.CSSProperties}
                      >
                        {entry.label}
                        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
                      </button>
                    ) : isLast ? (
                      <BreadcrumbPage className={classNames?.page}>{entry.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelect?.(i, entry);
                        }}
                        className={classNames?.link}
                      >
                        {entry.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className={classNames?.separator} />}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
        {panels}
      </BreadcrumbRoot>
    </>
  );
}
