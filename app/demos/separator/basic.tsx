"use client";

import { Separator } from "@/ui";

export default function Demo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Separator />
      <Separator>Or continue with</Separator>
      <div className="flex h-40 items-center gap-6">
        <Separator orientation="vertical" />
        <Separator orientation="vertical">Vertical</Separator>
      </div>
    </div>
  );
}
