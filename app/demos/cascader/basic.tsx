"use client";
import { Cascader, type CascaderNode } from "@/ui";

const tree: CascaderNode[] = [
  {
    value: "california",
    label: "California",
    children: [
      {
        value: "los-angeles",
        label: "Los Angeles",
        children: [
          { value: "downtown", label: "Downtown" },
          { value: "hollywood", label: "Hollywood" },
          { value: "pasadena", label: "Pasadena" },
        ],
      },
      {
        value: "san-francisco",
        label: "San Francisco",
        children: [
          { value: "soma", label: "SoMa" },
          { value: "richmond", label: "Richmond" },
          { value: "sunset", label: "Sunset" },
        ],
      },
    ],
  },
  {
    value: "new-york",
    label: "New York",
    children: [
      {
        value: "new-york-city",
        label: "New York City",
        children: [
          { value: "manhattan", label: "Manhattan" },
          { value: "brooklyn", label: "Brooklyn" },
        ],
      },
    ],
  },
  {
    value: "texas",
    label: "Texas",
    children: [
      {
        value: "houston",
        label: "Houston",
        children: [
          { value: "midtown", label: "Midtown" },
          { value: "uptown", label: "Uptown" },
        ],
      },
    ],
  },
  {
    value: "washington",
    label: "Washington",
    children: [
      {
        value: "seattle",
        label: "Seattle",
        children: [
          { value: "ballard", label: "Ballard" },
          { value: "fremont", label: "Fremont" },
        ],
      },
    ],
  },
];

export default function CascaderBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Cascader tree={tree} />
    </div>
  );
}
