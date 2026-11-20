"use client";

import { Collapse } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full flex-col items-center">
      <Collapse label="Basic usage">
        A single collapsible panel. Click the header row to expand or collapse the content below.
      </Collapse>
    </div>
  );
}
