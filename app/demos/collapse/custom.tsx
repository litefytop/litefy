"use client";

import { useState } from "react";
import { CollapsePanel, CollapseRoot, CollapseTrigger } from "@/ui";
import { ChevronDown } from "lucide-react";
const items = [
  {
    itemKey: "item-1",
    label: "Multiple Open by Default",
    panel: (
      <p className="text-muted-foreground">
        <code>Collapse.Group</code> supports multiple panels being open at the same time by default.
      </p>
    ),
  },
  {
    itemKey: "item-2",
    label: "Independent Toggle",
    panel: (
      <p className="text-muted-foreground">
        Each panel toggles independently. Without the <code>accordion</code> prop, opening one panel
        does not close the others.
      </p>
    ),
  },
  {
    itemKey: "item-3",
    label: "Controlled & Uncontrolled",
    panel: (
      <p className="text-muted-foreground">
        Supports both <code>value</code> and <code>defaultValue</code>. In controlled mode, the open
        keys are managed by an external state.
      </p>
    ),
  },
];
export default function Demo() {
  const [value, setValue] = useState<string | undefined>("item-1");

  return (
    <CollapseRoot>
    {items.map((cfg) => (
       <CollapseRoot   className="w-md rounded-md border border-border">
        <CollapseTrigger className="w-full justify-between p-4 text-sm font-medium" onClick={() => setValue(cfg.itemKey)}>
          {cfg.label}
          <ChevronDown
            data-open={value === cfg.itemKey}
            className="size-4 transition-transform duration-300 data-[open=true]:-rotate-180"
            aria-hidden
          />
        </CollapseTrigger>
        <CollapsePanel open={value === cfg.itemKey} className="px-4 pb-4 text-sm text-muted-foreground">
          {cfg.panel}
        </CollapsePanel>
      </CollapseRoot>
    ))}
    </CollapseRoot>
  );
}
