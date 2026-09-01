"use client";

import { Timeline } from "@/ui";

const items = [
  {
    time: "2026-08-30 10:24",
    heading: "Order placed",
    description: "Order #1042 created from web checkout",
  },
  {
    time: "2026-08-30 14:02",
    heading: "Payment confirmed",
    description: "Visa ···· 4242 charged $86.00",
  },
  {
    time: "2026-08-31 09:40",
    heading: "Shipped",
    description: "Package handed to carrier SF-EX",
  },
  {
    time: "2026-08-31 18:15",
    heading: "Delivered",
  },
];

export default function TimelineBasicDemo() {
  return <Timeline items={items} className="max-w-sm" />;
}
