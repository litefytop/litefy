import { type CascaderNode } from "@/ui";
import { Cascader } from "@/ui/skins";

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
        ],
      },
      { value: "san-francisco", label: "San Francisco" },
    ],
  },
  { value: "oregon", label: "Oregon" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <Cascader tree={tree} disabled />
    </div>
  );
}
