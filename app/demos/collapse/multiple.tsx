"use client";

import { Collapse } from "@/ui";

const items = [
  {
    value: "item-1",
    label: "Multiple Open by Default",
    content: (
      <p className="text-muted-foreground">
        <code>Collapse.Group</code> supports multiple panels being open at the same time by default.
      </p>
    ),
  },
  {
    value: "item-2",
    label: "Independent Toggle",
    content: (
      <p className="text-muted-foreground">
        Each panel toggles independently. Without the <code>accordion</code> prop, opening one panel
        does not close the others.
      </p>
    ),
  },
  {
    value: "item-3",
    label: "Controlled & Uncontrolled",
    content: (
      <p className="text-muted-foreground">
        Supports both <code>value</code> and <code>defaultValue</code>. In controlled mode, the open
        keys are managed by an external state.
      </p>
    ),
  },
];

export default function Demo() {
  return (
    <div>
      <Collapse.Group
        className="w-md divide-y rounded-md border border-border"
        defaultValue={["item-1", "item-2"]}
        items={items}
      />
    </div>
  );
}
