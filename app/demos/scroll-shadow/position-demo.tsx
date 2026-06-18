import { ScrollShadow } from "@/ui";

const longContent = Array.from({ length: 20 }, (_, i) => {
  const id = crypto.randomUUID();
  return (
    <p key={id} className="p-4 border-b last:border-b-0">
      Item {i + 1} - Shadow appears at different positions
    </p>
  );
});

export default function ScrollShadowPositionDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Top</h3>
        <ScrollShadow position="top" className="h-48 border rounded-md">
          {longContent}
        </ScrollShadow>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Bottom</h3>
        <ScrollShadow position="bottom" className="h-48 border rounded-md">
          {longContent}
        </ScrollShadow>
      </div>
    </div>
  );
}
