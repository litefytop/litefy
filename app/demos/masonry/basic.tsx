"use client";

import { Masonry } from "@/ui";

const cards = [
  { title: "Sunrise", height: "h-24", tone: "bg-primary/10" },
  { title: "Mountains", height: "h-44", tone: "bg-accent/20" },
  { title: "Ocean", height: "h-32", tone: "bg-primary/15" },
  { title: "Forest", height: "h-52", tone: "bg-accent/10" },
  { title: "Desert", height: "h-28", tone: "bg-primary/20" },
  { title: "Canyon", height: "h-40", tone: "bg-accent/15" },
  { title: "Glacier", height: "h-36", tone: "bg-primary/10" },
  { title: "Volcano", height: "h-48", tone: "bg-accent/25" },
  { title: "Meadow", height: "h-28", tone: "bg-primary/15" },
];

export default function MasonryBasicDemo() {
  return (
    <div className="w-full max-w-md">
      <Masonry
        items={cards}
        columns={{ base: 2, md: 3 }}
        getKey={(card) => card.title}
        renderItem={(card) => (
          <div className={`rounded-lg border p-3 ${card.height} ${card.tone}`}>
            <p className="text-sm font-medium">{card.title}</p>
          </div>
        )}
      />
    </div>
  );
}
