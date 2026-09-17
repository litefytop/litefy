"use client";

import * as React from "react";
import { Button, Steps } from "@/ui";

const content = [
  "Create your login credentials.",
  "Tell us a bit about yourself.",
  "Review everything and submit.",
];

export default function Demo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="w-full max-w-sm space-y-4">
      <Steps
        orientation="vertical"
        index={index}
        onChange={setIndex}
        items={[
          { title: "Account", description: "Create your login" },
          { title: "Profile", description: "Tell us about you" },
          { title: "Confirm", description: "Review and submit" },
        ]}
      />
      <div className="rounded-lg border p-3 text-sm text-muted-foreground">{content[index]}</div>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Back
        </Button>
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.min(2, i + 1))}
          disabled={index === 2}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
