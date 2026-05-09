import { Checkbox } from "@/component";

export default function CheckboxDisabled() {
  return (


        <Checkbox.Group disabled>
          <Checkbox value="apple">Apple</Checkbox>
          <Checkbox value="banana">Banana</Checkbox>
          <Checkbox value="orange">Orange</Checkbox>
        </Checkbox.Group>

  );
}
