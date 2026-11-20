"use client";

import { useState } from "react";
import { Checkbox, CheckboxGroup } from "@/ui/skins";

const OPTIONS = [
  { label: "Emerald", value: "emerald" },
  { label: "Cyan", value: "cyan" },
  { label: "Indigo", value: "indigo" },
];

export default function Demo() {
  const [selected, setSelected] = useState<string[]>(["emerald"]);

  const allChecked = selected.length === OPTIONS.length;
  const someChecked = selected.length > 0 && !allChecked;

  return (
    <div className="flex w-full flex-col items-center">
      <Checkbox
        checked={allChecked}
        indeterminate={someChecked}
        onCheckedChange={(checked) => setSelected(checked ? OPTIONS.map((o) => o.value) : [])}
      >
        Select all
      </Checkbox>
      <CheckboxGroup
        className="ps-8"
        value={selected}
        onChange={setSelected}
        label="Colors"
        options={OPTIONS}
      />
    </div>
  );
}
