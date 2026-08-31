"use client";

import * as React from "react";
import { Pager, Steps } from "@/ui/components";

const wizardSteps = [
  { title: "Account" },
  { title: "Profile" },
  { title: "Confirm" },
];

export default function WizardBasicDemo() {
  const [index, setIndex] = React.useState(0);
  const [maxIndex, setMaxIndex] = React.useState(0);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(wizardSteps.length - 1, next));
    setIndex(clamped);
    setMaxIndex((max) => Math.max(max, clamped));
  };

  const finish = () => {
    window.alert("Submitted");
  };

  return (
    <div className="w-full space-y-6">
      <Steps items={wizardSteps} index={index} maxIndex={maxIndex} onChange={go} />
      <Pager index={index} onChange={go} transition="view-transition" className="h-48 w-full" gesture={false}>
        <form className="flex h-full w-full flex-col justify-center gap-3 rounded-lg border p-4">
          <label className="text-sm font-medium">Email</label>
          <input
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="you@example.com"
          />
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="••••••••"
          />
        </form>
        <form className="flex h-full w-full flex-col justify-center gap-3 rounded-lg border p-4">
          <label className="text-sm font-medium">Display name</label>
          <input
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Your name"
          />
          <label className="text-sm font-medium">Bio</label>
          <textarea
            className="min-h-16 rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Tell something about yourself"
          />
        </form>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border p-4">
          <p className="text-sm font-medium">Ready to submit</p>
          <p className="max-w-64 text-center text-sm text-muted-foreground">
            Review your account and profile information, then submit the form.
          </p>
        </div>
      </Pager>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="h-9 cursor-pointer rounded-md border bg-background px-4 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          Back
        </button>
        {index === wizardSteps.length - 1 ? (
          <button
            type="button"
            onClick={finish}
            className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="h-9 cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
