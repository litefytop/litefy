"use client";

import { ChatInput } from "@/ui";

export default function ChatInputDisabledDemo() {
  return (
    <ChatInput
      disabled
      defaultValue="This draft can no longer be edited or sent."
      classNames={{ container: "w-96 max-w-full" }}
      placeholder="Composing is unavailable"
    />
  );
}
