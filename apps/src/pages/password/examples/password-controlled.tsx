import { useState } from "react";
import { Password } from "@/component";

export default function PasswordControlled() {
  const [value, setValue] = useState("");

  return (
    <Password
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Controlled password"
    />
  );
}
