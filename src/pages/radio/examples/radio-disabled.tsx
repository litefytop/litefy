import { Radio } from "@/components";

export default function RadioDisabled() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Group disabled</p>
        <Radio.Group disabled>
          <Radio value="apple">Apple</Radio>
          <Radio value="banana">Banana</Radio>
          <Radio value="orange">Orange</Radio>
        </Radio.Group>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Item disabled</p>
        <Radio.Group>
          <Radio value="apple">Apple</Radio>
          <Radio value="banana" disabled>Banana</Radio>
          <Radio value="orange">Orange</Radio>
        </Radio.Group>
      </div>
    </div>
  );
}
