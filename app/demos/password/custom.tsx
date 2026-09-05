"use client";

import { useState } from "react";
import { PasswordGroup, PasswordRoot, PasswordToggle } from "@/ui";

export default function Demo() {
  const [visible, setVisible] = useState(false);
  return (
    <PasswordGroup className="max-w-xs">
      <PasswordRoot placeholder="Confirm password..." visible={visible} />
      <PasswordToggle
        visible={visible}
        onClick={() => setVisible(!visible)}
        className="text-primary"
      />
    </PasswordGroup>
  );
}
