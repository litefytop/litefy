import { useState } from "react";
import { Input } from "@/component";

export default function InputControlled() {
  const [value, setValue] = useState("");

  return (
    <Input
      description={`Value: ${value || "empty"}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-64"
      placeholder="Controlled input"
    />
  );
}
