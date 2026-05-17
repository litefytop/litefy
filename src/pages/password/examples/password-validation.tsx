import { useState } from "react";
import { Password } from "@/component";

export default function PasswordValidation() {
  const [value, setValue] = useState("");

  return (
      <Password
        className="w-100"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (e.target.value.length < 8) {
            return { invalid: "Password must be at least 8 characters" };
          }
          if (!/[A-Z]/.test(e.target.value)) {
            return { invalid: "Password must contain at least one uppercase letter" };
          }
          if (!/[0-9]/.test(e.target.value)) {
            return { invalid: "Password must contain at least one number" };
          }
        }}
        label="Password"
        description="Must be at least 8 characters with uppercase and number"
        placeholder="Enter your password"
      />
  
  );
}
