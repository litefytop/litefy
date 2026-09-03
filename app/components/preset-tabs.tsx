"use client";

import { useState } from "react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { cn } from "@/ui";
import { PackageManagerTabs } from "./package-manager-tabs";
import { Source } from "./source";

export interface PresetTabsProps {
  items: string[];
}

export function PresetTabs({ items }: PresetTabsProps) {
  const [active, setActive] = useState(items[0]);

  return (
    <div className="grid gap-2 sm:grid-cols-[9rem_1fr]">
      <div
        role="tablist"
        aria-orientation="vertical"
        className="flex flex-row flex-wrap gap-1 sm:flex-col"
      >
        {items.map((name) => {
          const selected = name === active;
          const label = name.split("-")[0].replace(/^\w/, (c) => c.toUpperCase());
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(name)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm text-start text-muted-foreground transition-colors hover:bg-muted",
                selected && "bg-muted font-medium text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="min-w-0">
        <Tabs items={["Manual", "CLI"]}>
          <Tab value="Manual">
            <Source type="css" name={active} />
          </Tab>
          <Tab value="CLI">
            <PackageManagerTabs command={`litefy@latest add style-${active}`} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
