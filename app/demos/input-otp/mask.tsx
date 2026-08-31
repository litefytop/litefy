"use client";

import { InputOtp } from "@/ui";

export default function InputOtpMaskDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <InputOtp length={6} mask aria-label="Pin code" />
    </div>
  );
}
