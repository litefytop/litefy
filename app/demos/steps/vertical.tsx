"use client";

import * as React from "react";
import { Button, Input, Steps } from "@/ui/skins";

const steps = [
  {
    title: "Account",
    description: "Create your login",
    content: <Input name="email" label="Email" placeholder="you@example.com" />,
  },
  {
    title: "Profile",
    description: "Tell us about yourself",
    content: (
      <Input name="displayName" label="Display name" placeholder="Your name" />
    ),
  },
  {
    title: "Confirm",
    description: "Review and finish",
    content: <p>Review your details, then finish.</p>,
  },
];

export default function Demo() {
  const [index, setIndex] = React.useState(0);
  const [maxIndex, setMaxIndex] = React.useState(0);

  const go = (next: number) => {
    setIndex(next);
    setMaxIndex((m) => Math.max(m, next));
  };

  const finished = index === steps.length;

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-4">
      <Steps
        items={steps}
        index={index}
        maxIndex={maxIndex}
        orientation="vertical"
        onChange={go}
      />
      <div className="flex items-center justify-end gap-2">
        <Button
          data-variant="outline"
          onClick={() => go(Math.max(0, index - 1))}
          disabled={index === 0}
        >
          Back
        </Button>
        {finished ? null : (
          <Button onClick={() => go(index + 1)}>
            {index === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
