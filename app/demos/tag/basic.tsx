import { Tag } from "@/ui";

export default function TagBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2">
      <Tag>default</Tag>
      <Tag className="bg-emerald-600 text-white">stable</Tag>
      <Tag className="bg-amber-500 text-white">beta</Tag>
      <Tag className="bg-red-600 text-white">deprecated</Tag>
      <Tag className="bg-sky-600 text-white">v2.0</Tag>
    </div>
  );
}
