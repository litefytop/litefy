"use client";

import { PreviewCard } from "@/ui";

export default function PreviewCardImageDemo() {
  return (
    <PreviewCard
      src="https://picsum.photos/seed/typography/1200/800"
      alt="Typography specimen"
      title="Designing with tokens"
      description="An inline card rendered in place — omit trigger and href to embed it in content."
      classNames={{ image: "h-44" }}
    />
  );
}
