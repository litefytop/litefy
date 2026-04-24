import { Checkbox } from "@/components";

export default function CheckboxBasic() {
  return (
    <Checkbox.Group>
      <Checkbox value="remember">记住我</Checkbox>
      <Checkbox value="agree">同意协议</Checkbox>
      <Checkbox value="news">订阅新闻</Checkbox>
    </Checkbox.Group>
  );
}
