import { SegmentGroup } from "@/ui/skins";

const options = [
  { label: "List", value: "list" },
  { label: "Grid", value: "grid" },
  { label: "Table", value: "table" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <SegmentGroup variant="bordered" defaultValue="grid" options={options} />
      <SegmentGroup variant="borderless" defaultValue="table" options={options} />
      <SegmentGroup variant="well" defaultValue="list" options={options} />
    </div>
  );
}
