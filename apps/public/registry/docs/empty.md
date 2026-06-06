

## Usage

```tsx
import { Empty } from "@/component";

function App() {
  return <Empty />;
}
```

## Examples

### Basic

```tsx
<Empty />
```

### Custom Icon

```tsx
<Empty defaultIcon={<div className="text-4xl">📦</div>} />
```

### Custom Text

```tsx
<Empty defaultText="No Data" />
```

### Custom Content

```tsx
<Empty>
  <div className="flex flex-col items-center gap-4">
    <div className="text-4xl">📦</div>
    <div className="text-center">
      <p className="text-lg font-medium">No Content</p>
      <p className="text-sm text-muted-foreground">
        There's nothing here yet
      </p>
    </div>
  </div>
</Empty>
```

## API Reference

### Empty Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultIcon | React.ReactNode | CopyIcon | Custom icon |
| defaultText | React.ReactNode | "No Content" | Custom text |
| className | ClassNameValue | - | Custom class name |
