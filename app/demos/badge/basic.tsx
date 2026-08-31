"use client";

import { Badge } from "@/ui/components";

export default function BadgeBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Badge />
        <Badge count={1} />
        <Badge count={8} />
        <Badge count={120} />
      </div>
      <div className="flex items-center gap-4">
        <Badge>New</Badge>
        <Badge>Beta</Badge>
        <Badge className="bg-sky-600 text-white">v2.0</Badge>
      </div>
      <button
        type="button"
        className="relative inline-flex h-9 cursor-pointer items-center rounded-md border bg-background px-4 text-sm transition-colors hover:bg-muted"
      >
        Inbox
        <Badge count={3} className="absolute -top-1.5 -right-1.5" />
      </button>
    </div>
  );
}
