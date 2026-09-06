import { Capsule, Tag } from "@/ui";

export default function CapsuleLinkDemo() {
  return (
    <Capsule>
      <Tag className="rounded-none px-2.5 py-1 bg-neutral-600 text-white">docs</Tag>
      <a href="#" className="rounded-none px-2.5 py-1 bg-violet-600 text-white">litefy.dev</a>
    </Capsule>
  );
}
