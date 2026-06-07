

## Usage

```tsx
import { Image } from "@/component/ui/image";

function App() {
  return <Image src="/path/to/image.jpg" alt="Description" />;
}
```

## Examples

### Basic

```tsx
<Image src="/logo.svg" alt="Logo" className="w-20 h-20" />
```

### Custom Loading

```tsx
<Image 
  src="/logo.svg" 
  alt="Logo" 
  loading={<div className="w-20 h-20 bg-blue-100 animate-pulse">Loading...</div>}
  className="w-20 h-20"
/>
```

### Custom Failure

```tsx
<Image 
  src="/nonexistent.jpg" 
  alt="Fallback example" 
  failure={<div className="w-20 h-20 bg-red-100 flex items-center justify-center text-red-500">Error</div>}
  className="w-20 h-20"
/>
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | - | Image source URL (required) |
| alt | string | "" | Alternative text for the image |
| className | ClassNameValue | - | Additional CSS classes |
| loading | ReactNode | Skeleton | Custom loading placeholder |
| failure | ReactNode | "加载失败" | Custom failure placeholder |
| ...HTMLImageElementProps | HTMLImageElementProps | - | Other inherited img element props |

## CSS Classes

```css
// Base
base: "object-cover"
```
