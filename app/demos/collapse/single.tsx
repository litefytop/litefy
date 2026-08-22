"use client";

import { useState } from "react";
import { Collapse } from "@/ui";
import { ChevronDown } from "lucide-react";

export default function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Collapse open={open} onOpenChange={setOpen} className="w-md rounded-md border border-border">
        <Collapse.Trigger className="w-full justify-between p-4 text-sm font-medium">
          What is Litefy?
          <ChevronDown
            data-open={open}
            className="size-4 transition-transform duration-300 data-[open=true]:-rotate-180"
            aria-hidden
          />
        </Collapse.Trigger>
        <Collapse.Content className="px-4 pb-4 text-sm text-muted-foreground">
          Litefy is a source-localized, modern React UI toolkit. Components, Hooks, and styles can
          be copied directly into your project for full control.
        </Collapse.Content>
      </Collapse>
    </div>
  );
}
