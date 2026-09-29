"use client";

import { InputOtp } from "@/ui";

export default function InputOtpDisabledDemo() {
  return (
    <InputOtp
      length={6}
      defaultValue="123456"
      disabled
      aria-label="Disabled verification code"
    />
  );
}
