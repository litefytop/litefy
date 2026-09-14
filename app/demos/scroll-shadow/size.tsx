import { ScrollShadow } from "@/ui";

const ids = Array.from({ length: 20 }, (_, i) => i);

export default function ScrollShadowSizeDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Small (h-8)</h3>
        <ScrollShadow className={"h-48 border rounded-md"} classNames={{ edge: "h-8" }}>
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Custom shadow size demonstration
            </p>
          ))}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large (h-32)</h3>
        <ScrollShadow className={"h-48 border rounded-md"} classNames={{ edge: "h-32" }}>
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Custom shadow size demonstration
            </p>
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
