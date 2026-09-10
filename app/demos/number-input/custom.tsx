"use client";

import { InputGroup, NumberRoot } from "@/ui";

export default function Demo() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-muted/40 p-4">
      <p className="mb-3 text-sm font-medium">Assemble from Input parts</p>
      <p className="mb-3 text-sm text-muted-foreground">
        The stepping cue, thousands separators and prefix/suffix are composite features.
        For a fully custom panel, combine <code className="rounded bg-muted px-1 py-0.5 text-xs">InputGroup</code>,{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">NumberRoot</code> and plain
        content, driving the value yourself.
      </p>
      <InputGroup className="max-w-3xs">
        <span className="pr-1 text-sm text-muted-foreground">Qty</span>
        <NumberRoot defaultValue="1" inputMode="numeric" aria-label="Quantity" />
        <span className="pr-1 text-sm text-muted-foreground">pcs</span>
      </InputGroup>
    </div>
  );
}
