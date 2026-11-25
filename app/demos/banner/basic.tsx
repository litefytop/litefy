"use client";

import { useState } from "react";
import { Banner } from "@/ui/skins";
import { Switch } from "@/ui/skins";

const messages = [
  {
    key: "release",
    content: "🎉 Litefy v2.0 is out — new Context Menu and Banner components",
  },
  {
    key: "docs",
    content: "📚 New composition guides: Combobox, Multi Select, Date Picker",
  },
  {
    key: "theme",
    content: "📣 12 brand themes with automatic surface tuning",
  },
];

export default function Demo() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="flex w-full flex-col gap-3 items-center">
      <Switch checked={playing} onCheckedChange={setPlaying}>
        Scrolling
      </Switch>
      <Banner items={messages} speed={20} playing={playing} closable />
    </div>
  );
}
