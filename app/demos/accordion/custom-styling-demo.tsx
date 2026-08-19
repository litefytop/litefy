"use client";

import { Heart, Palette, Zap } from "lucide-react";
import { Accordion } from "@/ui";

export default function CustomStylingDemo() {
  return (
    <Accordion.Root className="w-md rounded-xl">
      <Accordion.Item value="item-1">
        <Accordion.Trigger className="[&>svg]:hidden">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <span>Card style with top rounded</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="text-muted-foreground">
          <p className="text-sm">
            Use wrapper className to apply
            <code className="bg-muted px-1.5 py-0.5 rounded">rounded-t-lg</code>.
            All items use consistent card background.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-2">
        <Accordion.Trigger className="[&>svg]:hidden">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Card style without rounding</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="text-muted-foreground">
          <p className="text-sm">
            Every part can be customized independently. This middle item has no
            extra rounding.
          </p>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="item-3">
        <Accordion.Trigger className="[&>svg]:hidden">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>Card style with bottom rounded</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className="italic text-muted-foreground/90">
          <p className="text-sm">
            Each sub-component accepts className. Change rounding, background,
            shadows, or any Tailwind class.
          </p>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
