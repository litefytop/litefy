"use client";

import * as React from "react";
import { Button, Steps } from "@/ui/components";

const items = [
  { title: "Account", description: "Basic info" },
  { title: "Profile", description: "Details" },
  { title: "Preferences", description: "Settings" },
  { title: "Confirm", description: "Review" },
];

export default function StepsLockedDemo() {
  const [index, setIndex] = React.useState(0);
  const [maxIndex, setMaxIndex] = React.useState(0);

  const go = (next: number) => {
    setIndex(next);
    setMaxIndex((m) => Math.max(m, next));
  };

  return (
    <div className="w-full space-y-6">
      <Steps items={items} index={index} maxIndex={maxIndex} onChange={go} />
      <p className="text-sm text-muted-foreground">
        Visited steps stay clickable — future steps stay locked until reached.
      </p>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => go(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          Back
        </Button>
        <span className="text-sm text-muted-foreground">Step {index + 1} of {items.length}</span>
        <Button
          variant="outline"
          onClick={() => go(Math.min(items.length - 1, index + 1))}
          disabled={index === items.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
