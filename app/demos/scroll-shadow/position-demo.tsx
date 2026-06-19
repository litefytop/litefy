import { ScrollShadow } from "@/ui";

const ids = Array.from({ length: 20 }, (_, i) => i);

export default function ScrollShadowPositionDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Top</h3>
        <ScrollShadow edges="top" className="h-48 border rounded-md">
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Shadow appears at different positions
            </p>
          ))}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Bottom</h3>
        <ScrollShadow edges="bottom" className="h-48 border rounded-md">
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Shadow appears at different positions
            </p>
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
