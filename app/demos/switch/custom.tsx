"use client";

import { useState } from "react";
import { SwitchLabel, SwitchRoot, SwitchThumb, SwitchTrack } from "@/ui";

export default function Demo() {
  const [checked, setChecked] = useState(false);
  return (
    <SwitchLabel>
      <SwitchTrack
        checked={checked}
        className="w-14 h-7 bg-muted data-checked:bg-emerald-600"
      >
        <SwitchRoot
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <SwitchThumb
          checked={checked}
          className="w-6 h-6 data-checked:translate-x-7"
        />
      </SwitchTrack>
      <span className="text-sm font-medium">Large switch</span>
    </SwitchLabel>
  );
}
