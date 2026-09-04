"use client";
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { List, PopoverContent } from "..";

export type CascaderNode = {
  value: string;
  label: string;
  children?: CascaderNode[];
};

interface CascaderProps {
  tree: CascaderNode[];
}

type CascaderTriggerProps = React.ComponentProps<"button">;

function CascaderTrigger({ children, ...props }: CascaderTriggerProps) {
  return (
    <button
      {...props}
      className="min-w-0 flex-1 truncate transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-ring"
    >
      {children}
    </button>
  );
}

export function Cascader({ tree }: CascaderProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [openLevel, setOpenLevel] = React.useState<number | null>(null);
  const [path, setPath] = React.useState<CascaderNode[]>([]);
  const [selected, setSelected] = React.useState<CascaderNode | null>(null);

  const triggerRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const levels = React.useMemo(
    () => [tree, ...path.map((node) => node.children ?? [])],
    [path, tree],
  );

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
    <div className="flex min-w-0 items-center">
      {path.length === 0 ? (
        <CascaderTrigger
          ref={(el) => {
            triggerRefs.current[0] = el;
          }}
          aria-expanded={openLevel === 0}
          onClick={() => handleTriggerClick(0)}
          className="text-muted-foreground"
          style={{ anchorName: `--cascader-${uid}-level-0` }}
        >
          Select your location
        </CascaderTrigger>
      ) : (
        <>
          {path.map((node, i) => (
            <React.Fragment key={node.value}>
              {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />}
              <CascaderTrigger
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                aria-expanded={openLevel === i}
                onClick={() => handleTriggerClick(i)}
                className="text-muted-foreground"
                style={{ anchorName: `--cascader-${uid}-level-${i}` }}
              >
                {node.label}
              </CascaderTrigger>
            </React.Fragment>
          ))}
          {selected && (
            <>
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
              <CascaderTrigger
                ref={(el) => {
                  triggerRefs.current[path.length] = el;
                }}
                aria-expanded={openLevel === path.length}
                onClick={() => handleTriggerClick(path.length)}
                className="font-medium text-foreground hover:text-foreground"
                style={{ anchorName: `--cascader-${uid}-level-${path.length}` }}
              >
                {selected.label}
              </CascaderTrigger>
            </>
          )}
        </>
      )}
    </div>
  );

  const panels = levels.map((items, level) => {
    const isOpen = openLevel === level;
    return (
      <PopoverContent
        key={level}
        open={isOpen}
        onOpenChange={(v) => {
          if (!v) setOpenLevel(null);
        }}
        alignX="start"
        style={{
          positionAnchor: `--cascader-${uid}-level-${level}`,
          width: "18rem",
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
      </PopoverContent>
    );
  });

  return (
    <>
      <div className="w-72 rounded-md border bg-background text-sm">{trigger}</div>
      {panels}
    </>
  );
}
