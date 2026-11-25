"use client";

import { Collapse } from "@/ui/skins";

export default function Demo() {
  return (
    <Collapse
      label="Disabled panel"
      disabled
      defaultOpen
      className="mx-auto w-full"
    >
      This panel stays open while its trigger is disabled.
    </Collapse>
  );
}
