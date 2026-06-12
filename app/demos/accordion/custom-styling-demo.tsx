"use client";

import { Accordion } from "@/components/ui/accordion";
import { Palette, Zap, Heart } from "lucide-react";

export default function CustomStylingDemo() {
  return (
    <Accordion className="w-md bg-card rounded-xl">
      <Accordion.Item
        value="item-1"
        label={
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <span>Card style with top rounded</span>
          </div>
        }
        slotProps={{
          content: { className: "text-muted-foreground" },
        }}
      >
        <p className="text-sm">
          Use <code className="bg-muted px-1.5 py-0.5 rounded">slotProps.wrapper</code> to apply <code>rounded-t-lg</code>.
          All items use <code>bg-card</code> for consistent card background.
        </p>
      </Accordion.Item>

      <Accordion.Item
        value="item-2"
        label={
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span>Card style without rounding</span>
          </div>
        }
        slotProps={{
          content: { className: "text-muted-foreground" },
        }}
      >
        <p className="text-sm">
          Every part can be customized independently. This middle item has no extra rounding.
        </p>
      </Accordion.Item>

      <Accordion.Item
        value="item-3"
        label={
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span>Card style with bottom rounded</span>
          </div>
        }
        slotProps={{
          content: { className: "italic text-muted-foreground/90" },
        }}
      >
        <p className="text-sm">
          <code>slotProps</code> gives full control over inner components.
          Change rounding, background, shadows, or any Tailwind class.
        </p>
      </Accordion.Item>
    </Accordion>
  );
}
