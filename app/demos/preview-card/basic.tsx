"use client";

import { Card, Image, Tooltip } from "@/ui";

export default function PreviewCardBasicDemo() {
  return (
    <Tooltip
      delay={200}
      content={
        <Card className="w-72">
          <Image
            src="https://picsum.photos/seed/preview-card/1200/800"
            alt="Preview"
            className={"h-32 w-full"}
          />
          <div className="p-3">
            <h3 className="text-sm font-semibold">Litefy Preview Card</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Hovering the link renders an image card as a rich preview.
            </p>
          </div>
        </Card>
      }
    >
      <a
        href="#preview-card"
        className="text-primary underline-offset-4 hover:text-accent hover:underline"
      >
        Litefy Preview Card
      </a>
    </Tooltip>
  );
}
