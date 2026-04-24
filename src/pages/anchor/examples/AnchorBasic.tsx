import { Anchor } from "@/components";

export default function AnchorBasic() {
  return (
    <div className="border rounded-lg p-4 w-48">
      <Anchor>
        <Anchor.Item id="">介绍</Anchor.Item>
        <Anchor.Item id="">功能特性</Anchor.Item>
        <Anchor.Item id="">使用方法</Anchor.Item>
        <Anchor.Item id="">API 参考</Anchor.Item>
      </Anchor>
    </div>
  );
}
