import { Accordion } from "@/components";

export default function AccordionMultiple() {
  return (
    <Accordion allowMultiple>
      <Accordion.Item value="item-1" title="JavaScript">
        <p>一种广泛用于网页开发的脚本语言。</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" title="TypeScript">
        <p>JavaScript 的超集，添加了类型系统。</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" title="React">
        <p>用于构建用户界面的 JavaScript 库。</p>
      </Accordion.Item>
    </Accordion>
  );
}
