"use client";

import * as React from "react";
import { Steps } from "@/ui/components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const items = [
  { title: "Account", description: "Basic info" },
  { title: "Profile", description: "Details" },
  { title: "Preferences", description: "Settings" },
  { title: "Confirm", description: "Review" },
];

export default function StepsBasicDemo() {
  const [index, setIndex] = React.useState(0);
  const [maxIndex, setMaxIndex] = React.useState(0);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, next));
    setIndex(clamped);
    setMaxIndex((max) => Math.max(max, clamped));
  };

  return (
    <div className="w-full space-y-6">
      <Steps items={items} index={index} maxIndex={maxIndex} onChange={go} />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="size-4" /> Back
        </button>
        <span className="text-sm text-muted-foreground">
          Step {index + 1} of {items.length} — visited steps are clickable, future steps are locked
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === items.length - 1}
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
