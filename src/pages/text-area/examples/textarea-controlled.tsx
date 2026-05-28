import { useState } from "react";
import { Textarea } from "@/component/ui/text-area";

export function TextareaControlled() {
  const [value, setValue] = useState("受控内容");

  return (
    <Textarea

      value={value}
      onChange={(e) => setValue(e.target.value)}

    />
  );
}
