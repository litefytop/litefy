import { Anchor } from "@/components";

export default function AnchorWithSections() {
  return (
    <div className="border rounded-lg p-4 w-56">
      <Anchor>
        <Anchor.Section id="" title="介绍" />
        <Anchor.Section id="" title="功能">
          <Anchor.Item id="">功能 1</Anchor.Item>
          <Anchor.Item id="">功能 2</Anchor.Item>
          <Anchor.Item id="">功能 3</Anchor.Item>
        </Anchor.Section>
        <Anchor.Section id="" title="用法" />
        <Anchor.Section id="" title="API" />
      </Anchor>
    </div>
  );
}
