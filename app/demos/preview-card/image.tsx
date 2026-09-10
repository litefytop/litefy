"use client";

import { PreviewCard } from "@/ui";

export default function PreviewCardImageDemo() {
  return (
    <PreviewCard
      src="https://picsum.photos/seed/preview-card/1200/800"
      alt="Preview"
      title="Litefy Preview Card"
      description="An image card composed of the Card component, an image on top and text below."
      classNames={{ image: "h-44" }}
    />
  );
}
