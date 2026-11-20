"use client";

import { Masonry } from "@/ui";
import { Card } from "@/ui/skins";

const cards = [
  { title: "Sunrise", height: 48 },
  { title: "Mountains", height: 88 },
  { title: "Ocean", height: 64 },
  { title: "Forest", height: 104 },
  { title: "Desert", height: 56 },
  { title: "Canyon", height: 80 },
  { title: "Glacier", height: 72 },
  { title: "Volcano", height: 96 },
  { title: "Meadow", height: 56 },
];

export default function MasonryBasicDemo() {
  return (
    <Masonry
      items={cards}
      columns={{ base: 2, md: 3 }}
      getKey={(card) => card.title}
      renderItem={(card) => (
        <Card
          className="p-2 text-sm font-medium"
          style={{ height: card.height }}
        >
          <p>{card.title}</p>
        </Card>
      )}
    />
  );
}
