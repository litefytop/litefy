"use client";

import * as React from "react";
import { AnimatedContent, Button, Card } from "@/ui/skins";

const PANELS = [
  { title: "Draft", body: "Collect the raw notes and outline the structure." },
  { title: "Review", body: "Share with the team and fold in the feedback." },
  { title: "Ship", body: "Publish the page and watch the metrics come in." },
];

export default function Demo() {
  const [step, setStep] = React.useState(0);
  const panel = PANELS[step];
  return (
    <div className="flex flex-col items-center gap-2">
      <Card className="h-36">
        <AnimatedContent direction="up" distance={20}>
          <div key={panel.title} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{panel.title}</h3>
            <p className="text-sm text-foreground">{panel.body}</p>
          </div>
        </AnimatedContent>
      </Card>
      <Button data-variant="outline" onClick={() => setStep((step + 1) % PANELS.length)}>
        Next step
      </Button>
    </div>
  );
}