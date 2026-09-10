"use client";

import { InputGroup, InputLeading, InputRoot, InputTrailing } from "@/ui";

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <InputGroup>
        <InputLeading>$</InputLeading>
        <InputRoot type="text" placeholder="0.00" />
        <InputTrailing>USD</InputTrailing>
      </InputGroup>
      <InputGroup invalid>
        <InputRoot type="text" defaultValue="not-an-email" aria-invalid />
        <InputTrailing>Invalid</InputTrailing>
      </InputGroup>
      <InputGroup>
        <InputRoot type="text" placeholder="Disabled" disabled />
      </InputGroup>
    </div>
  );
}
