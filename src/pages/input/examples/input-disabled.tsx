import { Input } from "@/component";

export default function InputDisabled() {
  return (
    <div className="space-y-4 w-80">
      <Input disabled placeholder="禁用状态" />
      <Input disabled value="禁用且有值" />
    </div>
  );
}
