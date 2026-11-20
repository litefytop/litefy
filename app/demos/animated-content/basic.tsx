"use client";

import * as React from "react";
import { AnimatedContent, Button, Card } from "@/ui/skins";

const PANELS = [
  { title: "Draft", body: "Collect the raw notes and outline the structure." },
  { title: "Review", body: "Share with the team and fold in the feedback." },
  { title: "Ship", body: "Publish the page and watch the metrics come in." },
];

const BLOCKS = ["Palette", "Tokens", "Typography", "Rules", "Motion", "Layout"];

export default function Demo() {
  const [step, setStep] = React.useState(0);
  const panel = PANELS[step];
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Card className="h-36 w-80">
          <AnimatedContent direction="up" distance={20}>
            <div key={panel.title} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">{panel.title}</h3>
              <p className="text-sm text-surface-fg">{panel.body}</p>
            </div>
          </AnimatedContent>
        </Card>
        <Button data-variant="outline" onClick={() => setStep((step + 1) % PANELS.length)}>
          Next step
        </Button>
      </div>
      <div className="flex h-56 w-80 flex-col gap-3 overflow-y-auto rounded-lg border p-3">
        {BLOCKS.map((label) => (
          <AnimatedContent
            key={label}
            once={false}
            distance={32}
            className="shrink-0 rounded-md border bg-surface p-3 text-sm font-medium"
          >
            {label}
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}