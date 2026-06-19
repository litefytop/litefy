import { ScrollShadow } from "@/ui";

const ids = Array.from({ length: 20 }, (_, i) => i);

export default function ScrollShadowSizeDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Small (32px)</h3>
        <ScrollShadow size="32px" className="h-48 border rounded-md">
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Custom shadow size demonstration
            </p>
          ))}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Large (128px)</h3>
        <ScrollShadow size="128px" className="h-48 border rounded-md">
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
