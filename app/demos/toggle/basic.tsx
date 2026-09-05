"use client";

import { Toggle } from "@/ui";
import { Bold, Italic, Underline } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Toggle defaultChecked>
        <Bold className="size-4" />
        Bold
      </Toggle>
      <Toggle>
        <Italic className="size-4" />
        Italic
      </Toggle>
      <Toggle disabled>
        <Underline className="size-4" />
        Disabled
      </Toggle>
    </div>
  );
}
