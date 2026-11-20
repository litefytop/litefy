import { SegmentGroup } from "@/ui/skins";

const options = [
  { label: "List", value: "list" },
  { label: "Grid", value: "grid" },
  { label: "Table", value: "table" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <SegmentGroup variant="primary" defaultValue="grid" options={options} />
      <SegmentGroup variant="text" defaultValue="table" options={options} />
    </div>
  );
}
