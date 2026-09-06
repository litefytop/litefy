import { cn, Tag } from "@/ui";

export default function TagVariantsDemo() {
  return (
    <div className="flex items-center gap-3">
      <a href="#" className={cn(Tag.className, "bg-violet-600 text-white")}>link tag</a>
      <button type="button" className={cn(Tag.className, "bg-emerald-600 text-white")}>button tag</button>
    </div>
  );
}
