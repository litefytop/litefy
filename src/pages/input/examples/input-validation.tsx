import { Input } from "@/component";
import { useState } from "react";

export default function InputValidation() {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  return (
    <div className="space-y-4 w-80">
      <Input
        label="Email"
        description="We'll never share your email with anyone else"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          const value = e.target.value;
          setEmail(value);
          if (value && !value.includes("@")) {
            return { invalid: "Please enter a valid email address" };
          }
        }}
      />

      <Input
        label="Age"
        description="Must be between 18 and 100"
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => {
          const value = e.target.value;
          setAge(value);
          if (value && (parseInt(value) < 18 || parseInt(value) > 100)) {
            return { invalid: "Age must be between 18 and 100" };
          }
        }}
      />
    </div>
  );
}
