"use client";
import { useState } from "react";
import { Popover } from "@/ui";
import { Button } from "@/ui";

const actions = ["Rename", "Duplicate", "Delete"];

export default function PopoverBasicDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <Popover
        trigger="Open"
        classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
      >
        <div className="flex flex-col">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => setSelected(action)}
              className={
                "px-2 py-1.5 text-left text-sm font-semibold rounded-sm hover:bg-hover" +
                (action === "Delete" ? " text-destructive" : "")
              }
            >
              {action}
            </button>
          ))}
        </div>
      </Popover>
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
