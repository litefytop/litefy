"use client";

import { Toggle } from "@/ui";

const options = [
  { label: "Bold", value: "bold" },
  { label: "Italic", value: "italic" },
  { label: "Underline", value: "underline" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Toggle.Group variant="text" defaultValue={[options[0].value]} options={options} />
      <p className="text-xs text-muted-foreground">text</p>
    </div>
  );
}
