import { Anchor } from "@/component";

export default function AnchorWithSections() {
  return (
    <div className="border rounded-lg p-4 w-56">
      <Anchor>
        <Anchor.Section href="#intro" title="介绍" />
        <Anchor.Section title="功能">
          <Anchor.Item href="#feature1">功能 1</Anchor.Item>
          <Anchor.Item href="#feature2">功能 2</Anchor.Item>
          <Anchor.Item href="#feature3">功能 3</Anchor.Item>
        </Anchor.Section>
        <Anchor.Section href="#usage" title="用法" />
        <Anchor.Section href="#api" title="API" />
      </Anchor>
    </div>
  );
}
