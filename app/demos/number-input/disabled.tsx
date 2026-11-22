import { NumberInput } from "@/ui/skins";

export default function Demo() {
  return (
    <div inert className="flex flex-col items-center">
      <NumberInput defaultValue={2026} max={999999} thousands disabled aria-label="Amount in US dollars" className="w-77 min-w-33" />
    </div>
  );
}
