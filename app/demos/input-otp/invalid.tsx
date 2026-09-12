"use client";

import { useState } from "react";
import { InputOtp } from "@/ui";

const EXPECTED = "520520";

export default function InputOtpInvalidDemo() {
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);

  return (
    <div className="flex max-w-md flex-col gap-3">
      <InputOtp
        length={6}
        value={value}
        invalid={invalid}
        aria-label="Verification code"
        onValueChange={(next) => {
          setValue(next);
          setInvalid(next.length === 6 && next !== EXPECTED);
        }}
      />
      {invalid && (
        <span className="text-sm text-danger" role="alert">
          Wrong code — the expected one is {EXPECTED}
        </span>
      )}
    </div>
  );
}
