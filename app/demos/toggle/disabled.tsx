import { Bold } from "@/components/icons";
import { Toggle } from "@/ui/skins";

export default function Demo() {
  return (
    <Toggle defaultChecked disabled inert>
      <Bold />
      Bold
    </Toggle>
  );
}
