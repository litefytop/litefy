import { Accordion } from "@/component";

export default function AccordionBasic() {
  return (
    <Accordion>
      <Accordion.Item value="item-1" title="什么是 React?">
        <p>React 是一个用于构建用户界面的 JavaScript 库。</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" title="为什么使用 React?">
        <p>React 采用组件化开发，数据驱动视图，生态丰富。</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" title="如何开始?">
        <p>使用 Create React App 或 Vite 可以快速搭建项目。</p>
      </Accordion.Item>
    </Accordion>
  );
}
