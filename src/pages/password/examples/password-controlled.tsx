import { useState } from "react";
import { Password } from "@/component";

export default function PasswordControlled() {
  const [value, setValue] = useState("");

  return (
    <Password
      className="w-64"
      description={`Value: ${value || "empty"}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Controlled password"
    />
  );
}
