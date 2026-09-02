"use client";
import * as React from "react";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbRoot,
  BreadcrumbSeparator,
  cn,
  type ClassNameValue,
  PopoverContent,
  usePopoverTrigger,
  type BreadcrumbLinkProps,
} from "@/ui";

export interface BreadcrumbEntry {
  value: string;
  label: React.ReactNode;
  menu?: BreadcrumbEntry[];
}

export interface BreadcrumbMenuProps {
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
    popoverContent?: ClassNameValue;
  };
}

interface BreadcrumbMenuTriggerProps extends BreadcrumbLinkProps {
  entry: BreadcrumbEntry;
  index: number;
  isOpen: boolean;
  setOpenIndex: (v: number | null) => void;
}

function BreadcrumbMenuTrigger({
  entry,
  index,
  isOpen,
  setOpenIndex,
  ...props
}: BreadcrumbMenuTriggerProps) {
  const { triggerProps } = usePopoverTrigger({
    open: isOpen,
    onOpenChange: (o) => setOpenIndex(o ? index : null),
    mode: "hover",
    hoverDelayClose: 200,
  });

  return (
    <BreadcrumbLink
      {...triggerProps}
      {...props}
      href="#"
      onClick={(e) => {
        e.preventDefault();
        triggerProps.onClick(e);
      }}
    >
      {entry.label}
    </BreadcrumbLink>
  );
}

export function BreadcrumbMenu({
  items,
  placeholder,
  onSelect,
  className,
  classNames,
}: BreadcrumbMenuProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);

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
    onSelect?.(index, entry);
  };

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
              const isOpen = openIndex === i;
              const breadcrumbAnchorName = `--breadcrumb-${uid}-${i}`;
              return (
                <React.Fragment key={entry.value}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbMenuTrigger
                        index={i}
                        entry={entry}
                        isOpen={isOpen}
                        setOpenIndex={setOpenIndex}
                        onClick={() => handleMenuSelect(i, entry)}

                        style={{ anchorName: breadcrumbAnchorName }}
                      >
                        {entry.label}
                      </BreadcrumbMenuTrigger>
                    ) : (
                      <BreadcrumbPage> {entry.label}</BreadcrumbPage>
                    )}
                    <PopoverContent
                      open={openIndex === i}
                      onOpenChange={(o) => {
                        if (!o) setOpenIndex(null);
                      }}

                      style={{
                        positionAnchor: breadcrumbAnchorName,
                      }}
                      className={cn("max-h-64 min-w-32 overflow-auto", classNames?.popoverContent)}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                      onKeyDown={(e) => {
                        const buttons = Array.from(
                          e.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
                        );
                        const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          buttons[(idx + 1 + buttons.length) % buttons.length]?.focus();
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          buttons[(idx - 1 + buttons.length) % buttons.length]?.focus();
                        }
                      }}
                    >
                      <ul role="menu" className="flex flex-col">
                        {entry.menu!.map((menuEntry) => (
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
                    </PopoverContent>
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className={classNames?.separator} />}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </BreadcrumbRoot>
    </>
  );
}

const tree: BreadcrumbEntry[] = [
  {
    value: "home",
    label: "Home",
    menu: [
      {
        value: "docs",
        label: "Docs",
        menu: [
          { value: "getting-started", label: "Getting Started" },
          { value: "theming", label: "Theming" },
          {
            value: "components",
            label: "Components",
            menu: [
              { value: "breadcrumb", label: "Breadcrumb" },
              { value: "pagination", label: "Pagination" },
              { value: "tabs", label: "Tabs" },
            ],
          },
        ],
      },
      {
        value: "charts",
        label: "Charts",
        menu: [
          { value: "line", label: "Line Chart" },
          { value: "bar", label: "Bar Chart" },
        ],
      },
    ],
  },
];

import { useState } from "react";
export default function BreadcrumbBasicDemo() {
  const [items, setItems] = useState<BreadcrumbEntry[]>([tree[0]]);
  return (
    <div className="w-md text-start">
      <BreadcrumbMenu
        items={items}
        placeholder="Select a page..."
        onSelect={(index, entry) => setItems((prev) => [...prev.slice(0, index), entry])}
      />
    </div>
  );
}
