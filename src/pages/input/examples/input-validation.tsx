import { Input } from "@/component";
import { useState } from "react";

export default function InputValidation() {
  const [email, setEmail] = useState("");

  return (
      <Input
        label="Email"
        description="We'll never share your email with anyone else"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);
          if (value && !value.includes("@")) {
            return { invalid: "Please enter a valid email address" };
          }
        }}
      />
  );
}
