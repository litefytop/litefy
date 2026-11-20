"use client";

import { InputOtp } from "@/ui/skins";

export default function InputOtpMaskDemo() {
  return (
    <div className="flex flex-col items-center">
      <InputOtp length={6} mask aria-label="Pin code" />
    </div>
  );
}
