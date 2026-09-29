"use client";

import { CircleCheck, CreditCard, Package, ShoppingCart } from "lucide-react";
import { Timeline } from "@/ui";

const items = [
  {
    marker: <ShoppingCart className="size-3" />,
    time: "2026-08-30 10:24",
    heading: "Order placed",
    description: "Order #1042 created from web checkout", // design-detect-disable-line hardcoded-color（文案里的订单号，不是色值）
  },
  {
    marker: <CreditCard className="size-3" />,
    time: "2026-08-30 14:02",
    heading: "Payment confirmed",
    description: "Visa ···· 4242 charged $86.00",
  },
  {
    marker: <Package className="size-3" />,
    time: "2026-08-31 09:40",
    heading: "Shipped",
    description: "Package handed to carrier SF-EX",
  },
  {
    marker: <CircleCheck className="size-3 text-success" />,
    time: "2026-08-31 18:15",
    heading: "Delivered",
  },
];

export default function TimelineMarkerDemo() {
  return <Timeline items={items} className="max-w-sm" />;
}
