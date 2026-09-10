import { ScrollShadow } from "@/ui";

const ids = Array.from({ length: 20 }, (_, i) => i);

export default function ScrollShadowArrowDemo() {
  return (
    <ScrollShadow edges={["top", "bottom"]} className="h-64 border rounded-md">
      {ids.map((id) => (
        <p key={id} className="p-4 border-b last:border-b-0">
          Item {id + 1} - Click an arrow to jump straight to that end
        </p>
      ))}
    </ScrollShadow>
  );
}
