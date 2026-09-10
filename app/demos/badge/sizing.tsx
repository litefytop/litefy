"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/ui";

export default function BadgeSizingDemo() {
  return (
    <div className="flex items-center gap-8">
      <Badge />
      <Badge className="size-8 rounded-full" label={3}>
        <Bell className="size-5" />
      </Badge>
    </div>
  );
}
