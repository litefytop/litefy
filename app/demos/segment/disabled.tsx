import { SegmentGroup } from "@/ui/skins";

export default function Demo() {
  return (
    <SegmentGroup
      defaultValue="list"
      disabled
      inert
      options={[
        { label: "List", value: "list" },
        { label: "Grid", value: "grid" },
        { label: "Table", value: "table" },
      ]}
    />
  );
}
