import { ScrollShadow } from "@/ui";

const ids = Array.from({ length: 20 }, (_, i) => i);

export default function ScrollShadowBasicDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <h3 className="mb-2 text-sm font-medium">Bottom (default)</h3>
        <ScrollShadow className="h-48 border rounded-md">
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Scroll to see the shadow effect
            </p>
          ))}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Top + bottom</h3>
        <ScrollShadow edges={["top", "bottom"]} className="h-48 border rounded-md">
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Scroll to see the shadow effect
            </p>
          ))}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Small edge (h-8)</h3>
        <ScrollShadow className="h-48 border rounded-md" classNames={{ edge: "h-8" }}>
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Scroll to see the shadow effect
            </p>
          ))}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Large edge (h-32)</h3>
        <ScrollShadow className="h-48 border rounded-md" classNames={{ edge: "h-32" }}>
          {ids.map((id) => (
            <p key={id} className="p-4 border-b last:border-b-0">
              Item {id + 1} - Scroll to see the shadow effect
            </p>
          ))}
        </ScrollShadow>
      </div>
    </div>
  );
}
