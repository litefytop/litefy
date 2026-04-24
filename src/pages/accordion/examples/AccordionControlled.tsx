import { useState } from "react";
import { Accordion } from "@/components";

export default function AccordionControlled() {
  const [openKeys, setOpenKeys] = useState<string[]>(["item-1"]);

  return (
    <Accordion openKeys={openKeys} onOpenChange={setOpenKeys}>
      <Accordion.Item value="item-1" title="受控模式">
        <p>当前打开的 keys: {openKeys.join(", ")}</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" title="点击切换">
        <p>通过 openKeys 和 onOpenChange 控制展开状态。</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" title="初始化">
        <p>可以在 defaultOpenKeys 中设置初始展开的项。</p>
      </Accordion.Item>
    </Accordion>
  );
}
