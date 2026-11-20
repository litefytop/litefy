"use client";

import { Checkbox } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Checkbox defaultChecked lineThrough>
        Finish the design review
      </Checkbox>
      <Checkbox lineThrough>Ship the release notes</Checkbox>
      <Checkbox lineThrough>Review pull requests</Checkbox>
    </div>
  );
}
