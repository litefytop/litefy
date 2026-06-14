"use client";

import { Input } from "@/components/ui";

export default function InputBasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Input type="text" placeholder="Enter text" />
      <Input type="email" placeholder="Enter email" />
      <Input type="search" placeholder="Search..." />
    </div>
  );
}
