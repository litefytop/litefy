"use client";
import { useState } from "react";
import {
  FloatingToc,
  FloatingTocTrigger,
  FloatingTocBar,
  FloatingTocContent,
  FloatingTocItem,
} from "@/ui/skins";

const entries = [
  { value: "overview", label: "Overview", level: 1 },
  { value: "scroll-spy", label: "Scroll Spy", level: 2 },
  { value: "adaptive-bars", label: "Adaptive Bars", level: 2 },
  { value: "expand", label: "Expanding the Panel", level: 1 },
  { value: "placement", label: "Placement", level: 2 },
  { value: "controlled", label: "Controlled State", level: 1 },
  { value: "recap", label: "Recap", level: 1 },
];

export default function Demo() {
  const [active, setActive] = useState("overview");
  return (
    <div className="flex h-full w-full scale-100 items-center justify-center">
      <FloatingToc>
        <FloatingTocTrigger className="static translate-y-0">
          {entries.map((entry) => (
            <FloatingTocBar key={entry.value} active={entry.value === active} level={entry.level} />
          ))}
        </FloatingTocTrigger>
        <FloatingTocContent>
          {entries.map((entry) => (
            <FloatingTocItem
              key={entry.value}
              active={entry.value === active}
              level={entry.level}
              onClick={() => setActive(entry.value)}
            >
              {entry.label}
            </FloatingTocItem>
          ))}
        </FloatingTocContent>
      </FloatingToc>
    </div>
  );
}
