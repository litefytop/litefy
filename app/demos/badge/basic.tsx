"use client";

import { Badge } from "@/ui";

export default function BadgeBasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge />
      <Badge label={3} />
    </div>
  );
}
