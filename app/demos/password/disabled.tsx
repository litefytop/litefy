"use client";

import { Password } from "@/ui";

export default function PasswordDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Password disabled placeholder="Enter password..." />
      <Password disabled defaultValue="s3cr3t" defaultVisible />
    </div>
  );
}
