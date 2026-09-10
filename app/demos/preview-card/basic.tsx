"use client";

import { PreviewCard } from "@/ui";

export default function PreviewCardBasicDemo() {
  return (
    <PreviewCard
      trigger="Litefy Preview Card"
      href="#preview-card"
      src="https://picsum.photos/seed/preview-card/1200/800"
      alt="Preview"
      title="Litefy Preview Card"
      description="Hovering the link renders an image card as a rich preview."
    />
  );
}
