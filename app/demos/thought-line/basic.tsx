"use client";

import { ThoughtLine } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-10">
      <ThoughtLine
        steps={["Reading the question", "Searching your notes", "Comparing sources"]}
        aria-label="Assistant is thinking"
      />
      <ThoughtLine working={false} elapsed={4.2} steps={["Reading the question", "Searching your notes"]} />
    </div>
  );
}
