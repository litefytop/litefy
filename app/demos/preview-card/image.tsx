"use client";

import { Card, Image } from "@/ui";

export default function PreviewCardImageDemo() {
  return (
    <Card className="w-full max-w-sm">
      <Image
        src="https://picsum.photos/seed/preview-card/1200/800"
        alt="Preview"
        classNames={{ root: "h-44 w-full" }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">Litefy Preview Card</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          An image card composed of the Card component, an image on top and text below.
        </p>
      </div>
    </Card>
  );
}
