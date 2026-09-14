"use client";

import { Collapse } from "@/ui";

export default function Demo() {
  return (
    <div>
      <Collapse
        label="Collapse and Accordion"
        className="max-w-md min-w-xs rounded-md border border-border"
      >
        Use the Collapse component for a single collapsible panel, and the Accordion component for
        multiple collapsible panels.
      </Collapse>
    </div>
  );
}
