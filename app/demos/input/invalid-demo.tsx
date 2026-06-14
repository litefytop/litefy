"use client";

import { Input } from "@/components/ui";

export default function InputInvalidDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input type="email" placeholder="Enter email" invalid />
      <Input type="text" placeholder="Valid input" />
    </div>
  );
}
