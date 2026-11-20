"use client";

import { useReducedMotion } from "@/ui/utils";

export default function Demo() {
  const reducedMotion = useReducedMotion();

  return (
    <p role="status" className="mx-auto break-words text-sm">
      <code>prefers-reduced-motion: {reducedMotion ? "reduce" : "no-preference"}</code>
    </p>
  );
}
