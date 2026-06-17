import { ScrollShadow } from "@/ui";

const longContent = Array.from({ length: 20 }, (_, i) => {
  const id = crypto.randomUUID();
  return (
    <p key={id} className="p-4 border-b last:border-b-0">
      Item {i + 1} - Scroll to see the shadow effect at the bottom
    </p>
  );
});

export default function ScrollShadowBasicDemo() {
  return (
    <ScrollShadow className="h-64 border rounded-md">
      {longContent}
    </ScrollShadow>
  );
}
