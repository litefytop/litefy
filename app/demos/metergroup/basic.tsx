import { MeterGroup } from "@/ui/skins";

export default function Demo() {
  const storage = [
    { label: "Documents", value: 24 },
    { label: "Photos", value: 38 },
    { label: "Video", value: 21 },
  ];
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-6">
      <MeterGroup aria-label="Storage usage" value={storage} max={100} />
    </div>
  );
}
