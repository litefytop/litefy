import { Input } from "@/component";

export default function InputDisabled() {
  return (
    <div className="space-y-4 w-80">
      <Input disabled placeholder="Disabled" />
      <Input disabled value="Disabled with value" />
    </div>
  );
}
