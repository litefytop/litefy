"use client";

import { LatticeLoader } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <LatticeLoader label="Thinking" aria-label="Task in progress" />
      <LatticeLoader status="done" elapsed={12.6} aria-label="Task done" />
      <LatticeLoader status="error" elapsed={8.1} aria-label="Task failed" />
    </div>
  );
}
