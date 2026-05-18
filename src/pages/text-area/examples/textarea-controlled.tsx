import { useState } from "react";
import { Textarea } from "@/component/ui/text-area";

export function TextareaControlled() {
  const [value, setValue] = useState("受控内容");

  return (
    <Textarea
      label="受控文本域"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      description={`当前字符数：${value.length}`}
    />
  );
}
