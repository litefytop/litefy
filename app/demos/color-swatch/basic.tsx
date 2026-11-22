"use client";

import { useState } from "react";
import { ColorSwatch } from "@/ui/skins";
import { STYLE_TEMPLATES } from "@/lib/style-templates";

const cfg = STYLE_TEMPLATES[0].palettes[0];

export default function Demo() {
  const [active, setActive] = useState("default");

  return (
    <ColorSwatch
      aria-label={cfg.label.zh}
      options={cfg.options.map((o) => ({
        value: o.name,
        label: o.label,
        color: o.swatch ?? `var(${cfg.dotVar})`,
      }))}
      value={active}
      onValueChange={setActive}
    />
  );
}
