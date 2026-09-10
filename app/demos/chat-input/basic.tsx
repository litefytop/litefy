"use client";

import * as React from "react";
import { Brain, Globe } from "lucide-react";
import { ChatInput, Toggle } from "@/ui";

export default function Demo() {
  const [deepThink, setDeepThink] = React.useState(false);
  const [webSearch, setWebSearch] = React.useState(false);

  return (
    <ChatInput
      classNames={{ container: "w-96 max-w-full" }}
      placeholder="Type a message, try pasting a screenshot…"
      attach
      onSend={({ text, images }) => {
        console.log("send:", text, images, { deepThink, webSearch });
      }}
      actions={
        <>
          <Toggle checked={deepThink} onCheckedChange={setDeepThink} className="px-2.5 py-1 text-xs">
            <Brain />
            Deep think
          </Toggle>
          <Toggle checked={webSearch} onCheckedChange={setWebSearch} className="px-2.5 py-1 text-xs">
            <Globe />
            Web search
          </Toggle>
        </>
      }
    />
  );
}
