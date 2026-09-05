"use client";

import { useState } from "react";
import { InputOtp } from "@/ui";

export default function InputOtpControlledDemo() {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col items-start gap-3">
      <InputOtp length={4} value={value} onValueChange={setValue} aria-label="Code" />
      <p className="text-sm text-muted-foreground">Value: {value || "-"}</p>
    </div>
  );
}
