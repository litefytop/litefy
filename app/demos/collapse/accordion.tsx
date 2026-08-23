"use client";

import { useState } from "react";
import { Accordion } from "@/ui";
import { Plus } from "lucide-react";

const items = [
  {
    itemKey: "item-1",
    label: "Mutually Exclusive",
    panel: (
      <p className="text-muted-foreground">
        Adding the <code>accordion</code> prop enables mutual exclusion: only one panel can be open
        at a time.
      </p>
    ),
  },
  {
    itemKey: "item-2",
    label: "Controlled Value",
    panel: (
      <p className="text-muted-foreground">
        In accordion mode the value type is <code>string</code>, and <code>onValueChange</code>{" "}
        receives <code>string | undefined</code>.
      </p>
    ),
  },
  {
    itemKey: "item-3",
    label: "Custom Icon",
    panel: (
      <p className="text-muted-foreground">
        Use <code>itemTriggerIcon</code> or a per-item <code>icon</code> function that receives the{" "}
        <code>open</code> state to drive dynamic effects.
      </p>
    ),
  },
];

export default function Demo() {
  const [value, setValue] = useState<string | undefined>("item-1");

  return (
    <div>
      <Accordion
        multiple={false}
        activeKeys={value}
        onKeyChange={setValue}
        className="w-md divide-y rounded-md border border-border"
        items={items}
        itemIcon={(open) => (
          <Plus
            data-open={open}
            className="size-4 transition-transform duration-300 data-[open=true]:-rotate-45"
          />
        )}
      />
    </div>
  );
}
