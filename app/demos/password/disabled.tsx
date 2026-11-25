import { Password } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-col items-center">
      <Password defaultValue="hunter2" disabled />
    </div>
  );
}
