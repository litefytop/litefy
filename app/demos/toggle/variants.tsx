import { ToggleGroup } from "@/ui/skins";

const options = [
  { label: "Bold", value: "bold" },
  { label: "Italic", value: "italic" },
  { label: "Underline", value: "underline" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <ToggleGroup defaultValue={["bold"]} options={options} />
      <ToggleGroup variant="well" defaultValue={["italic"]} options={options} />
    </div>
  );
}
