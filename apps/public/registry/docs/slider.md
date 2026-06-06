

## Usage

```tsx
import { Slider } from "@/component/ui/slider";

function App() {
  return <Slider defaultValue={50} />;
}
```

## Examples

### Basic

```tsx
<Slider defaultValue={50} />
```

### Controlled

```tsx
const [value, setValue] = useState(50);

<Slider
  value={value}
  onChange={(e) => setValue(Number(e.target.value))}
/>
```

### Orientation

```tsx
<Slider defaultValue={50} orientation="horizontal" />
<Slider defaultValue={50} orientation="vertical" />
```
