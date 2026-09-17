"use client";

import * as React from "react";
import { Button, Steps } from "@/ui/components";

const items = [
  { title: "Account", description: "Basic info" },
  { title: "Profile", description: "Details" },
  { title: "Preferences", description: "Settings" },
  { title: "Confirm", description: "Review" },
];

export default function StepsBasicDemo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="w-full space-y-6">
      <Steps items={items} index={index} onChange={setIndex} />
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Back
        </Button>
        <span className="text-sm text-muted-foreground">Step {index + 1} of {items.length}</span>
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
          disabled={index === items.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
