## Installation

```bash
npm install @your-org/ui
```

## Usage

```tsx
import { NumberField } from "@/component/ui/number-field";

function App() {
  return <NumberField label="Quantity" />;
}
```

## Examples

### Basic

```tsx
<NumberField label="Quantity" description="Please select quantity" />
```

### Controlled

```tsx
const [value, setValue] = useState(5);

<NumberField
  label="Controlled"
  value={value}
  onValueChange={setValue}
/>
```

### Min/Max

```tsx
<NumberField
  label="Range Limit"
  min={0}
  max={100}
  defaultValue={50}
/>
```

### Step

```tsx
<NumberField
  label="Step"
  step={0.5}
  defaultValue={0}
/>
```

### Disabled

```tsx
<NumberField
  label="Disabled"
  disabled
  defaultValue={10}
/>
```

### Validation

**自定义校验规则**

```tsx
const [value, setValue] = useState(5);
const [invalid, setInvalid] = useState<string>();

const handleChange = (val: number) => {
  // 示例：偶数才有效
  if (val % 2 !== 0) {
    return { invalid: "Please enter an even number" };
  }
  setInvalid(undefined);
};

<NumberField
  label="Validation"
  description="Please enter an even number"
  value={value}
  onValueChange={handleChange}
  invalid={invalid}
  min={0}
  max={10}
/>
```

**自动范围校验**

```tsx
<NumberField
  label="Range Validation"
  description="Min 0, Max 10"
  min={0}
  max={10}
  defaultValue={5}
/>
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | - | Current value (controlled mode) |
| defaultValue | number | 0 | Default value (uncontrolled mode) |
| onValueChange | (val: number) => void | { invalid?: string } | Value change callback |
| label | ReactNode | - | Label text |
| description | ReactNode | - | Description text |
| invalid | string | - | Invalid state message |
| min | number | -Infinity | Minimum value |
| max | number | Infinity | Maximum value |
| step | number | 1 | Step increment |
| disabled | boolean | false | Disabled state |
| slotProps | NumberFieldItemProps | - | Internal element props pass-through |

## slotProps Config

| Prop | Type | Description |
|------|------|-------------|
| root | React.ComponentProps<"div"> | Root container props |
| label | React.ComponentProps<"label"> | Label element props |
| group | React.ComponentProps<"div"> | Group container props |
| btn | React.ComponentProps<"button"> | Button element props |
| desc | React.ComponentProps<"small"> | Description element props |
| error | React.ComponentProps<"small"> | Error message element props |
