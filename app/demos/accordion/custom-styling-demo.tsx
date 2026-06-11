"use client";

import { Accordion } from "@/components/ui/accordion";
import { Palette, Zap, Heart } from "lucide-react";

export default function CustomStylingDemo() {
  return (
    <Accordion className="w-md">
      <Accordion.Item
        value="item-1"
        label={
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-gray-600" />
            <span>Custom Border Style</span>
          </div>
        }
        slotProps={{
          wrapper: { className: "border-l-4 border-gray-600 bg-gray-50" },
          trigger: { className: "hover:bg-gray-100" },
        }}
      >
        <p className="text-sm text-muted-foreground">
          This item has a left border accent using <code className="bg-muted px-1.5 py-0.5 rounded">border-l-4 border-gray-600</code>. 
          Perfect for highlighting important sections.
        </p>
      </Accordion.Item>
      <Accordion.Item
        value="item-2"
        label={
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-gray-700" />
            <span>Custom Background</span>
          </div>
        }
        slotProps={{
          wrapper: { className: "border-l-4 border-gray-700 bg-gray-100" },
          trigger: { className: "hover:bg-gray-200" },
        }}
      >
        <p className="text-sm text-muted-foreground">
          This item uses a subtle background with <code className="bg-muted px-1.5 py-0.5 rounded">bg-gray-100</code>. 
          Great for drawing attention to special features.
        </p>
      </Accordion.Item>
      <Accordion.Item
        value="item-3"
        label={
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-gray-800" />
            <span>Custom Icon & Colors</span>
          </div>
        }
        slotProps={{
          wrapper: { className: "border-l-4 border-gray-800 bg-gray-200" },
          trigger: { className: "text-gray-900 hover:text-gray-950 hover:bg-gray-300" },
          content: { className: "text-gray-800" },
        }}
      >
        <p className="text-sm">
          This item has custom text colors and a heart icon. 
          Use <code className="bg-muted px-1.5 py-0.5 rounded">slotProps</code> to customize every part.
        </p>
      </Accordion.Item>
    </Accordion>
  );
}
