"use client";

import { Banner } from "@/ui";

const messages = [
  {
    key: "release",
    content: "🎉 Litefy v2.0 is out — new Context Menu, Wizard and Banner components",
  },
  {
    key: "docs",
    content: "📚 New composition guides: Combobox, Multi Select, Date Picker",
  },
  {
    key: "theme",
    content: "🎨 12 brand themes with automatic surface tuning",
  },
];

export default function BannerBasicDemo() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-md">
      <Banner
        items={messages}
        speed={20}
        classNames={{ item: "gap-2 px-8 py-2 text-sm whitespace-nowrap" }}
      />
    </div>
  );
}
