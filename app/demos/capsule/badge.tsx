import { Capsule, Tag } from "@/ui";

const tagClass = "rounded-none px-2.5 py-1";

export default function CapsuleBadgeDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        <Capsule>
          <Tag className={`${tagClass} bg-neutral-600 text-white`}>build</Tag>
          <Tag className={`${tagClass} bg-emerald-600 text-white`}>passing</Tag>
        </Capsule>
        <Capsule>
          <Tag className={`${tagClass} bg-neutral-600 text-white`}>npm</Tag>
          <Tag className={`${tagClass} bg-red-600 text-white`}>v1.2.3</Tag>
        </Capsule>
        <Capsule>
          <Tag className={`${tagClass} bg-neutral-600 text-white`}>license</Tag>
          <Tag className={`${tagClass} bg-sky-600 text-white`}>MIT</Tag>
        </Capsule>
      </div>
      <Capsule>
        <Tag className={`${tagClass} bg-neutral-600 text-white`}>docs</Tag>
        <Tag className={`${tagClass} bg-violet-600 text-white`}>litefy.dev</Tag>
      </Capsule>
    </div>
  );
}
