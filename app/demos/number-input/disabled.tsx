import { NumberInput } from "@/ui/skins";

export default function Demo() {
  return <NumberInput defaultValue={2026} max={999999} thousands disabled aria-label="Amount in US dollars" />;
}
