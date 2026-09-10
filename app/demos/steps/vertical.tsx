"use client";

import * as React from "react";
import { Steps } from "@/ui";

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
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex h-8 cursor-pointer items-center rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(2, i + 1))}
          disabled={index === 2}
          className="inline-flex h-8 cursor-pointer items-center rounded-md border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
