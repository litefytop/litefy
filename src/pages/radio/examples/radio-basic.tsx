import { Radio } from "@/components";

export default function RadioBasic() {
  return (
    <Radio.Group>
      <Radio value="apple">Apple</Radio>
      <Radio value="banana">Banana</Radio>
      <Radio value="orange">Orange</Radio>
    </Radio.Group>
  );
}
