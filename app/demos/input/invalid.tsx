"use client";
import { useState } from "react";
import { Input } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setValue(val);
    if (!val) {
      setInvalid(false);
      return;
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    setInvalid(!isEmail);
  }

  return (
    <div className="flex flex-col gap-4 w-72">
      <Input
        type="email"
        placeholder="Enter email"
        value={value}
        invalid={invalid}
        onChange={handleChange}
      />
      {invalid && <span className="text-destructive text-sm">Please enter a valid email address</span>}
    </div>
  );
}
