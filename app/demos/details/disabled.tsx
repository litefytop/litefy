"use client";

import { Details } from "@/ui/skins";

export default function Demo() {
  return (
    <Details label="Disabled disclosure" disabled open className="mx-auto w-full">
      This panel stays open while its trigger is disabled.
    </Details>
  );
}
