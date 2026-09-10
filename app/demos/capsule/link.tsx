import { Capsule, Tag } from "@/ui";

export default function CapsuleLinkDemo() {
  return (
    <a href="#">
      <Capsule>
        <Tag className="bg-neutral">docs</Tag>
        <Tag className="bg-primary">litefy.dev</Tag>
      </Capsule>
    </a>
  );
}
