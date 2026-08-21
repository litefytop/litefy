"use client";

import { Checkbox } from "@/ui";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Checkbox defaultChecked>Accept terms</Checkbox>
      <Checkbox disabled>Unavailable option</Checkbox>
    </div>
  );
}
