import { ColorSwatch } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <ColorSwatch
        aria-label="Theme color"
        defaultValue="sky"
        disabled
        options={[
          { value: "sky", label: "Sky", color: "#0ea5e9" },
          { value: "rose", label: "Rose", color: "#f43f5e" },
          { value: "amber", label: "Amber", color: "#f59e0b" },
          { value: "emerald", label: "Emerald", color: "#10b981" },
        ]}
      />
    </div>
  );
}
