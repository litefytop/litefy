"use client";

import { SeparatorLine, SeparatorText } from "@/ui";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <SeparatorLine className="border-t border-dashed bg-transparent" />
      <div className="flex items-center gap-3 w-full">
        <SeparatorLine className="flex-1 border-t border-dashed bg-transparent" />
        <SeparatorText className="text-primary font-medium uppercase tracking-widest text-xs">
          Parts
        </SeparatorText>
        <SeparatorLine className="flex-1 border-t border-dashed bg-transparent" />
      </div>
    </div>
  );
}
