"use client";

import * as React from "react";
import { Button, Steps } from "@/ui/skins";

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
    setIndex(next);
    setMaxIndex((m) => Math.max(m, next));
  };

  return (
    <div className="flex w-full flex-col gap-4 items-center">
      <Steps items={items} index={index} maxIndex={maxIndex} onChange={go} />
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          data-variant="outline"
          onClick={() => go(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          Back
        </Button>
        <span>
          Step {index + 1} of {items.length}
        </span>
        <Button
          onClick={() => go(Math.min(items.length - 1, index + 1))}
          disabled={index === items.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
