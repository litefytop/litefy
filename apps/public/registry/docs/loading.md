## Installation

```bash
npm install @your-org/ui
```

## Usage

```tsx
import { Loading } from "@/component";

function App() {
  return (
    <Loading loading={true}>
      <div>Content</div>
    </Loading>
  );
}
```

## Examples

### Basic

```tsx
<Loading loading={loading}>
  <div>Content</div>
</Loading>
```

### Custom

```tsx
<Loading
  loading={loading}
  skeleton={<div>Skeleton content</div>}
  fallback={<div>Custom loading indicator</div>}
>
  <div>Content</div>
</Loading>
```
