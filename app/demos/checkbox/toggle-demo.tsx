"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Bold, Italic, Underline } from "lucide-react";

export default function CheckboxToggleDemo() {
  return (
    <Checkbox.Group>
      <Checkbox variant="toggle" className="rounded-l-full">
        <Bold className="size-4" />
      </Checkbox>
      <Checkbox variant="toggle">
        <Italic className="size-4" />
      </Checkbox>
      <Checkbox variant="toggle" defaultChecked className="rounded-r-full">
        <Underline className="size-4" />
      </Checkbox>
    </Checkbox.Group>
  );
}
