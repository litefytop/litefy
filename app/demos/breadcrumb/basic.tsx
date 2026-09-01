"use client";

import { useState } from "react";
import { Breadcrumb, type BreadcrumbEntry } from "@/ui";

const tree: BreadcrumbEntry[] = [
  {
    value: "home",
    label: "Home",
    menu: [
      {
        value: "docs",
        label: "Docs",
        menu: [
          { value: "getting-started", label: "Getting Started" },
          { value: "theming", label: "Theming" },
          {
            value: "components",
            label: "Components",
            menu: [
              { value: "breadcrumb", label: "Breadcrumb" },
              { value: "pagination", label: "Pagination" },
              { value: "tabs", label: "Tabs" },
            ],
          },
        ],
      },
      {
        value: "charts",
        label: "Charts",
        menu: [
          { value: "line", label: "Line Chart" },
          { value: "bar", label: "Bar Chart" },
        ],
      },
    ],
  },
];

export default function BreadcrumbBasicDemo() {
  const [items, setItems] = useState<BreadcrumbEntry[]>([tree[0]]);

  return (
    <Breadcrumb
      items={items}
      placeholder="Select a page..."
      onSelect={(index, entry) => setItems((prev) => [...prev.slice(0, index), entry])}
    />
  );
}
