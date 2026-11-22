import { NumberField } from "@/ui/skins";

export default function Demo() {
  return (
    <div inert className="flex flex-col items-center">
      <NumberField min={1} max={99} defaultValue={1} disabled aria-label="Quantity" />
    </div>
  );
}
