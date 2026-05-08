import { Checkbox } from "@/component";

export default function CheckboxBasic() {
  return (
    <Checkbox.Group>
      <Checkbox value="remember">Remember me</Checkbox>
      <Checkbox value="agree">Agree to terms</Checkbox>
      <Checkbox value="news">Subscribe to newsletter</Checkbox>
    </Checkbox.Group>
  );
}
