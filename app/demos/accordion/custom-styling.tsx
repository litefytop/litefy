"use client";

import { Heart, Palette, Zap } from "lucide-react";
import { Accordion } from "@/ui";
import { useState } from "react";

export default function Demo() {
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const toggle = (value: string) => {
    setActiveKeys((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <Accordion.Root className="w-md rounded-xl bg-background">
      <Accordion.Item className="border-b">
        <Accordion.Trigger
          className="[&>svg]:hidden px-4 py-3 text-sm font-medium"
          onClick={() => toggle("palette")}
        >
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <span>Card style with top rounded</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content
          open={activeKeys.includes("palette")}
          className="px-4 pb-4 text-muted-foreground text-sm"
        >
          <p>
            Use wrapper className to apply
            <code className="bg-muted px-1.5 py-0.5 rounded">rounded-t-lg</code>. All items use
            consistent card background.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item className="border-b">
        <Accordion.Trigger
          className="[&>svg]:hidden px-4 py-3 text-sm font-medium"
          onClick={() => toggle("zap")}
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Card style without rounding</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content
          open={activeKeys.includes("zap")}
          className="px-4 pb-4 text-muted-foreground text-sm"
        >
          <p>Every part can be customized independently. This middle item has no extra rounding.</p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item>
        <Accordion.Trigger
          className="[&>svg]:hidden px-4 py-3 text-sm font-medium"
          onClick={() => toggle("heart")}
        >
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>Card style with bottom rounded</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content
          open={activeKeys.includes("heart")}
          className="px-4 pb-4 italic text-muted-foreground/90 text-sm"
        >
          <p>
            Each sub‑component accepts className. Change rounding, background, shadows, or any
            Tailwind class.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
