"use client";

import { CircleCheck, CreditCard, Package, ShoppingCart } from "@/components/icons";
import { Timeline } from "@/ui/skins";

const items = [
  {
    marker: <ShoppingCart />,
    time: "2026-08-30 10:24",
    heading: "Order placed",
    description: "Order #1042 created from web checkout",
  },
  {
    marker: <CreditCard />,
    time: "2026-08-30 14:02",
    heading: "Payment confirmed",
    description: "Visa ···· 4242 charged $86.00",
  },
  {
    marker: <Package />,
    time: "2026-08-31 09:40",
    heading: "Shipped",
    description: "Package handed to carrier SF-EX",
  },
  {
    marker: <CircleCheck />,
    time: "2026-08-31 18:15",
    heading: "Delivered",
  },
];

export default function TimelineMarkerDemo() {
  return <Timeline items={items} orientation="horizontal" />;
}
