import { Bold } from "@/components/icons";
import { Toggle } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <Toggle defaultChecked disabled>
        <Bold />
        Bold
      </Toggle>
    </div>
  );
}
