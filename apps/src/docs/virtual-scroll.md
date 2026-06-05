# Virtual Scroll

A high-performance virtual scroll component that only renders items in the visible area.

## Installation

```tsx
import { VirtualScroll } from "@/component";
```

## Examples

### Basic

```tsx
import { VirtualScroll } from "@/component";

const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

export default function VirtualScrollBasic() {
  return (
    <VirtualScroll
      items={items}
      itemHeight={40}
      containerHeight={400}
      renderItem={(item, index) => (
        <div className="h-10 flex items-center px-4 border-b hover:bg-muted">
          {item}
        </div>
      )}
    />
  );
}
```

## API Reference

### VirtualScroll Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | - | Array of items to render |
| `itemHeight` | `number` | - | Height of each item in pixels |
| `containerHeight` | `number` | - | Container height in pixels |
| `renderItem` | `(item: T, index: number) => React.ReactNode` | - | Function to render each item |
| `overscan` | `number` | `2` | Number of extra items to render above/below visible area |
| `onScroll` | `(scrollTop: number) => void` | - | Callback fired on scroll |
| `className` | `ClassNameValue` | - | Inner container className |
| `containerClassName` | `ClassNameValue` | - | Outer container className |
