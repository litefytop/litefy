"use client";

import { Separator } from "@/ui";

export default function Demo() {
  return (
    <div className="w-full max-w-sm rounded-lg border p-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-base font-semibold">Litefy UI</span>
        <span className="text-sm text-muted-foreground">An open-source UI component library.</span>
      </div>
      <Separator />
      <nav className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <a href="#" className="transition-colors hover:text-foreground">
          Blog
        </a>
        <Separator orientation="vertical" />
        <a href="#" className="transition-colors hover:text-foreground">
          Docs
        </a>
        <Separator orientation="vertical" />
        <a href="#" className="transition-colors hover:text-foreground">
          Source
        </a>
      </nav>
    </div>
  );
}
