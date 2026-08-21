"use client";

import { useState } from "react";
import { Checkbox } from "@/ui";
import { Heart } from "lucide-react";

export default function Demo() {
  const [values, setValues] = useState(["vue"]);

  return (
    <div className="flex flex-col gap-6">
      <Checkbox.Group
        value={values}
        onChange={setValues}
        itemIndicator={(checked) => (
          <Heart data-checked={checked || undefined} className={"data-checked:fill-primary"} />
        )}
        options={[
          { label: "React", value: "react" },
          { label: "Vue", value: "vue" },
          { label: "Angular", value: "angular" },
        ]}
      />

      <Checkbox.Group
        disabled
        defaultValue={["react"]}
        onChange={setValues}
        itemIndicator={(checked) => (
          <Heart data-checked={checked || undefined} className={"data-checked:fill-primary"} />
        )}
        options={[
          { label: "React", value: "react" },
          { label: "Vue", value: "vue" },
          { label: "Angular", value: "angular" },
        ]}
      />
    </div>
  );
}
