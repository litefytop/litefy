import { SegmentGroup } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <SegmentGroup
        defaultValue="list"
        disabled
        options={[
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
          { label: "Table", value: "table" },
        ]}
      />
    </div>
  );
}
