import { Capsule, Tag } from "@/ui";

export default function CapsuleBadgeDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        <Capsule>
          <Tag className={"bg-neutral"}>build</Tag>
          <Tag className={"bg-success"}>passing</Tag>
        </Capsule>
        <Capsule>
          <Tag className={"bg-neutral"}>npm</Tag>
          <Tag className={"bg-danger"}>v1.2.3</Tag>
        </Capsule>
        <Capsule>
          <Tag className={"bg-neutral"}>license</Tag>
          <Tag className={"bg-info"}>MIT</Tag>
        </Capsule>
      </div>
      <Capsule>
        <Tag className={"bg-neutral"}>docs</Tag>
        <Tag className={"bg-warning"}>litefy.dev</Tag>
      </Capsule>
    </div>
  );
}
