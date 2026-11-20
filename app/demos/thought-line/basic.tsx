"use client";

import { ThoughtLine } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full max-w-112 flex-col gap-10 mx-auto">
      <ThoughtLine
        steps={["Reading the question", "Searching your notes", "Comparing sources"]}
        aria-label="Assistant is thinking"
      />
      <ThoughtLine working={false} elapsed={4.2} steps={["Reading the question", "Searching your notes"]} />
    </div>
  );
}
