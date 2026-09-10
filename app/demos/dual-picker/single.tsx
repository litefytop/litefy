"use client";

import { useState } from "react";
import { DualPicker } from "@/ui";

interface Member {
  name: string;
  role: string;
}

const members: Member[] = [
  { name: "Ada Lovelace", role: "Engineering" },
  { name: "Grace Hopper", role: "Engineering" },
  { name: "Linus Pauling", role: "Research" },
  { name: "Marie Curie", role: "Research" },
];

export default function Demo() {
  const [owner, setOwner] = useState<string[]>([]);

  return (
    <div className="w-full max-w-xl">
      <DualPicker<Member>
        mode="single"
        options={members.map((m) => ({ value: m.name, option: m }))}
        getLabel={(m) => m.name}
        searchPlaceholder="Search members..."
        sourceTitle="Members"
        targetTitle="Owner"
        value={owner}
        onValueChange={setOwner}
      />
      <p className="mt-2 text-sm text-muted-foreground">Owner: {owner[0] ?? "—"}</p>
    </div>
  );
}
