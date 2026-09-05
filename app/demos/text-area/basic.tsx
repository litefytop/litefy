"use client";

import { Textarea } from "@/ui";

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Textarea placeholder="Leave a comment..." />
      <Textarea invalid placeholder="Invalid state" />
      <Textarea disabled placeholder="Disabled state" />
    </div>
  );
}
