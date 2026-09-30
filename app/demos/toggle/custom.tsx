"use client";

import { useState } from "react";
import { Toggle } from "@/ui";
import { Sparkles } from "lucide-react";

export default function Demo() {
  const [values, setValues] = useState<string[]>(["pill"]);
  const handleToggle = (val: string) => {
    setValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Toggle
        checked={values.includes("pill")}
        onCheckedChange={() => handleToggle("pill")}
        className="rounded-full px-4 py-2"
      >
        <Sparkles className="size-4" />
        Pill
      </Toggle>
      <Toggle
        checked={values.includes("dashed")}
        onCheckedChange={() => handleToggle("dashed")}
        className="rounded-full border border-dashed px-4 py-2 aria-pressed:bg-primary-accent aria-pressed:border-primary-accent"
      >
        <Sparkles className="size-4" />
        Dashed
      </Toggle>
    </div>
  );
}
