import { Anchor } from "@/component";

export default function AnchorBasic() {
  return (
    <div className="border rounded-lg p-4 w-48">
      <Anchor>
        <Anchor.Item href="#intro">介绍</Anchor.Item>
        <Anchor.Item href="#features">功能特性</Anchor.Item>
        <Anchor.Item href="#usage">使用方法</Anchor.Item>
        <Anchor.Item href="#api">API 参考</Anchor.Item>
      </Anchor>
    </div>
  );
}
