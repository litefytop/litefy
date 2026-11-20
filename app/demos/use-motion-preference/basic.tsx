"use client";

import { useMotionPreference, useReducedMotion } from "@/ui/utils";

export default function UseMotionPreferenceBasicDemo() {
  const motion = useMotionPreference();
  const systemReduced = useReducedMotion();

  return (
    <dl className="mx-auto grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      <dt>App setting</dt>
      <dd className="m-0">
        <code>{motion.mode}</code>
      </dd>
      <dt>System</dt>
      <dd className="m-0">
        <code>{systemReduced ? "reduce" : "no-preference"}</code>
      </dd>
      <dt>Result</dt>
      <dd className="m-0">
        <code>{motion.reduced ? "paused" : "playing"}</code>
      </dd>
    </dl>
  );
}
