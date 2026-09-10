"use client";

import { Badge } from "@/ui";

export default function BadgeMarkerColorDemo() {
  return (
    <div className="flex items-center gap-8">
      <Badge label="New" />
      <Badge label="New" classNames={{ label: "bg-emerald-600 text-white" }} />
    </div>
  );
}
