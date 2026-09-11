"use client";

import { InputGroup, InputLeading, InputRoot, InputTrailing } from "@/ui";

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <InputGroup>
        <InputLeading>$</InputLeading>
        <InputRoot type="text" placeholder="0.00" aria-label="Price in US dollars" />
        <InputTrailing>USD</InputTrailing>
      </InputGroup>
      <InputGroup invalid>
        <InputRoot
          type="text"
          defaultValue="not-an-email"
          aria-label="Email address"
          aria-invalid
        />
        <InputTrailing>Invalid</InputTrailing>
      </InputGroup>
      <InputGroup>
        <InputRoot type="text" placeholder="Disabled" aria-label="Disabled example" disabled />
      </InputGroup>
    </div>
  );
}
