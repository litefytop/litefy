"use client";

import { Switch } from "@/ui";

export default function SwitchCustomStylingDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Switch
        defaultChecked
        slotProps={{
          track: { className: "w-14 h-7 bg-emerald-500 data-checked:bg-emerald-600" },
          thumb: { className: "w-6 h-6 peer-checked:translate-x-7" },
        }}
      >
        Large success switch
      </Switch>
      <Switch
        slotProps={{
          track: { className: "bg-rose-200 data-checked:bg-rose-500" },
          thumb: { className: "bg-rose-50" },
        }}
      >
        Custom color scheme
      </Switch>
    </div>
  );
}
