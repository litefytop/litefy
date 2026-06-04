import { VirtualScroll } from "@/component";

const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

export default function VirtualScrollBasic() {
  return (
    <VirtualScroll
      items={items}
      itemHeight={40}
      renderItem={(item) => (
        <div className="h-10 flex items-center px-4 border-b hover:bg-muted">
          {item}
        </div>
      )}
    />
  );
}
