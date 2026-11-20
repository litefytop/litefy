"use client";

import { Separator } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col gap-3 mx-auto">
      <div className="flex flex-wrap gap-3">
        <span>Litefy UI</span>
        <span>An open-source UI component library.</span>
      </div>
      <Separator />
      <nav className="flex items-center gap-2">
        <a href="#blog">
          Blog
        </a>
        <Separator orientation="vertical" />
        <a href="#docs">
          Docs
        </a>
        <Separator orientation="vertical" />
        <a href="#source">
          Source
        </a>
      </nav>
    </div>
  );
}
