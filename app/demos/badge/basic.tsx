"use client";

import { Badge } from "@/ui";

export default function BadgeBasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Badge className="bg-background shadow-md" />
      <Badge className="bg-background shadow-md" label={3} />
    </div>
  );
}
