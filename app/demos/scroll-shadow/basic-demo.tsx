import { ScrollShadow } from "@/ui";

const ids = Array.from({ length: 20 }, (_, i) => i);

export default function ScrollShadowBasicDemo() {
  return (
    <ScrollShadow className="h-64 border rounded-md">
      {ids.map((id) => {
        const text = `Item ${id + 1} - Scroll to see the shadow effect at the bottom`;
        return (
          <p key={id} className="p-4 border-b last:border-b-0">
            {text}
          </p>
        );
      })}
    </ScrollShadow>
  );
}
