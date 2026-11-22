"use client";

import { useState } from "react";
import { Bold, Italic } from "@/components/icons";
import { Toggle } from "@/ui/skins";

export default function Demo() {
  const [italic, setItalic] = useState(true);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Toggle checked={italic} onCheckedChange={setItalic}>
        <Italic />
        Italic
      </Toggle>
      <Toggle>
        <Bold />
        Bold
      </Toggle>
    </div>
  );
}
