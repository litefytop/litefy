"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { List } from "@/ui";

type CascaderNode = {
  value: string;
  label: string;
  children?: CascaderNode[];
};

const tree: CascaderNode[] = [
  {
    value: "california",
    label: "California",
    children: [
      {
        value: "los-angeles",
        label: "Los Angeles",
        children: [
          { value: "downtown", label: "Downtown" },
          { value: "hollywood", label: "Hollywood" },
          { value: "pasadena", label: "Pasadena" },
        ],
      },
      {
        value: "san-francisco",
        label: "San Francisco",
        children: [
          { value: "soma", label: "SoMa" },
          { value: "richmond", label: "Richmond" },
          { value: "sunset", label: "Sunset" },
        ],
      },
    ],
  },
  {
    value: "new-york",
    label: "New York",
    children: [
      {
        value: "new-york-city",
        label: "New York City",
        children: [
          { value: "manhattan", label: "Manhattan" },
          { value: "brooklyn", label: "Brooklyn" },
        ],
      },
    ],
  },
  {
    value: "texas",
    label: "Texas",
    children: [
      {
        value: "houston",
        label: "Houston",
        children: [
          { value: "midtown", label: "Midtown" },
          { value: "uptown", label: "Uptown" },
        ],
      },
    ],
  },
  {
    value: "washington",
    label: "Washington",
    children: [
      {
        value: "seattle",
        label: "Seattle",
        children: [
          { value: "ballard", label: "Ballard" },
          { value: "fremont", label: "Fremont" },
        ],
      },
    ],
  },
];

export default function CascaderBasicDemo() {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const containerAnchor = `--cascader-${uid}`;
  const [openLevel, setOpenLevel] = React.useState<number | null>(null);
  const [path, setPath] = React.useState<CascaderNode[]>([]);
  const [selected, setSelected] = React.useState<CascaderNode | null>(null);
  const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const levels = React.useMemo(() => [tree, ...path.map((node) => node.children ?? [])], [path]);

  React.useEffect(() => {
    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === openLevel && !el.matches(":popover-open")) el.showPopover();
      if (i !== openLevel && el.matches(":popover-open")) el.hidePopover();
    });
  });

  React.useEffect(() => {
    if (openLevel === null) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRefs.current[openLevel]?.contains(target)) return;
      if (triggerRefs.current.some((el) => el?.contains(target))) return;
      setOpenLevel(null);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [openLevel]);

  const handleTriggerClick = (index: number) => {
    setPath((prev) => prev.slice(0, index));
    setSelected(null);
    setOpenLevel((prev) => (prev === index ? null : index));
  };

  const handleSelect = (node: CascaderNode) => {
    if (node.children) {
      setPath((prev) => [...prev.slice(0, path.length), node]);
      setOpenLevel(path.length + 1);
    } else {
      setSelected(node);
      setOpenLevel(null);
    }
  };

  const trigger = (
    <div className="flex min-w-0 items-center gap-1.5 ">
      {path.length === 0 ? (
        <button
          type="button"
          ref={(el) => {
            triggerRefs.current[0] = el;
          }}
          aria-expanded={openLevel === 0}
          onClick={() => handleTriggerClick(0)}
          className={`min-w-0 flex-1 truncate text-muted-foreground transition-colors px-3 py-2`}
        >
          Select your location
        </button>
      ) : (
        <>
          {path.map((node, i) => (
            <React.Fragment key={node.value}>
              {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />}
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                aria-expanded={openLevel === i}
                onClick={() => handleTriggerClick(i)}
                className={`min-w-0 flex-1 truncate text-muted-foreground transition-colors px-3 py-2`}
              >
                {node.label}
              </button>
            </React.Fragment>
          ))}
          {selected && (
            <>
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[path.length] = el;
                }}
                aria-expanded={openLevel === path.length}
                onClick={() => handleTriggerClick(path.length)}
                className={`min-w-0 flex-1 truncate font-medium text-foreground transition-colors hover:text-foreground${
                  openLevel === path.length ? " underline" : ""
                }`}
              >
                {selected.label}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  const panels = levels.map((items, level) => (
    <div
      key={level}
      ref={(el) => {
        panelRefs.current[level] = el;
      }}
      popover="manual"
      className="z-50 w-72 rounded-md border bg-background p-1 shadow-md"
      style={{
        positionAnchor: containerAnchor,
        positionArea: "bottom span-right",
        justifySelf: "start",
        positionTryFallbacks: "flip-block",
        margin: "4px 0 0",
      }}
    >
      <List
        items={items}
        renderItem={(node) => (
          <span className="flex items-center justify-between gap-2">
            <span>{node.label}</span>
            {node.children && <ChevronRight className="size-3.5 text-muted-foreground" />}
          </span>
        )}
        getKey={(node) => node.value}
        onSelect={handleSelect}
        className="max-h-56 w-full rounded-md"
      />
    </div>
  ));

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-72 rounded-md border bg-background  text-sm"
        style={{ anchorName: containerAnchor }}
      >
        {trigger}
      </div>
      {panels}
      <p className="text-sm text-muted-foreground">
        Selected:{" "}
        {path.length > 0 || selected
          ? [...path.map((node) => node.label), selected?.label].filter(Boolean).join(" / ")
          : "-"}
      </p>
    </div>
  );
}
