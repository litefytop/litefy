"use client";

import { useState } from "react";
import { Input, useFieldValidity } from "@/ui";

export default function Demo() {
  const { validity, setFieldError } = useFieldValidity();
  const [email, setEmail] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-1">
      <Input
        value={email}
        placeholder="you@example.com"
        aria-invalid={Boolean(validity.email) || undefined}
        onChange={(e) => {
          const next = e.target.value;
          setEmail(next);
          setFieldError(
            "email",
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next) ? null : "Enter a valid email",
          );
        }}
      />
      {validity.email ? (
        <small role="alert" className="text-danger indent-2 text-sm">
          {validity.email}
        </small>
      ) : (
        <small className="text-muted-foreground indent-2 text-sm">
          Parts mode — no wrapper, styles come from aria-invalid
        </small>
      )}
    </div>
  );
}
