"use client";

import * as React from "react";
import { AnimatedContent, Button } from "@/ui/skins";

const DIRECTIONS = ["up", "down", "left", "right"] as const;
const DURATIONS = ["sm", "md", "lg"] as const;

export default function Demo() {
  const [round, setRound] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-2 gap-4">
        {DIRECTIONS.map((direction) => (
          <AnimatedContent
            key={`${direction}-${round}`}
            direction={direction}
            distance={32}
            className="flex h-24 w-48 items-center justify-center rounded-lg border bg-surface text-sm font-medium"
          >
            {direction}
          </AnimatedContent>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {DURATIONS.map((duration) => (
          <AnimatedContent
            key={`${duration}-${round}`}
            duration={duration}
            distance={32}
            className="flex h-12 w-24 items-center justify-center rounded-md border bg-surface text-xs font-medium"
          >
            {duration}
          </AnimatedContent>
        ))}
      </div>
      <Button data-variant="outline" onClick={() => setRound(round + 1)}>
        Replay
      </Button>
    </div>
  );
}