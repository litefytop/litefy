"use client";

import { useState } from "react";
import { Switch } from "@/ui";

export default function SwitchControlledDemo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-4">
      <Switch checked={enabled} onCheckedChange={setEnabled}>
        Airplane mode
      </Switch>
      <p className="text-sm text-muted-foreground">
        Airplane mode is {enabled ? "on" : "off"}
      </p>
    </div>
  );
}
