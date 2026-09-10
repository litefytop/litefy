import { useState } from "react";
import { Select } from "@/ui";

const options = [
  {
    group: "Frontend",
    options: [
      { label: "React", value: "react" },
      { label: "Vue", value: "vue" },
      { label: "Angular", value: "angular" },
    ],
  },
  {
    group: "Backend",
    options: [
      { label: "Node.js", value: "node" },
      { label: "Python", value: "python" },
      { label: "Go", value: "go" },
    ],
  },
];

export default function SelectGroupedDemo() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  return (
    <Select
      value={selectedValue}
      onValueChange={setSelectedValue}
      options={options}
      placeholder="Select a technology..."
    />
  );
}
