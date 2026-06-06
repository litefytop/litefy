## Installation

```bash
npm install @your-org/ui
```

## Usage

```tsx
import { Checkbox } from "@/component/ui/checkbox";

function App() {
  return (
    <Checkbox label="I agree to the terms" />
  );
}
```

## Examples

### Basic

```tsx
<Checkbox label="I agree to the terms" />
```

### Controlled

```tsx
const [checked, setChecked] = useState(true);
<Checkbox
  checked={checked}
  onValueChange={setChecked}
  label={`Controlled: ${checked ? "Checked" : "Unchecked"}`}
/>
```

### Uncontrolled Group

```tsx
<Checkbox.Group
  defaultValue={["apple"]}
  onValueChange={(values) => console.log(values)}
>
  <Checkbox value="apple" label="Apple" />
  <Checkbox value="banana" label="Banana" />
  <Checkbox value="orange" label="Orange" />
</Checkbox.Group>
```

### Disabled

```tsx
<Checkbox disabled label="Disabled Checkbox" />
```

### Group Disabled

```tsx
<Checkbox.Group disabled>
  <Checkbox value="apple" label="Apple" />
  <Checkbox value="banana" label="Banana" />
  <Checkbox value="orange" label="Orange" />
</Checkbox.Group>
```

### Variants

```tsx
<Checkbox variant="checkbox" label="Checkbox Style" />
<Checkbox variant="toggle" label="Toggle Style" />
```

## API Reference

### Checkbox.Group Props

| Prop          | Type                      | Default | Description                                      |
| ------------- | ------------------------- | ------- | ------------------------------------------------ |
| defaultValue  | T[]                       | []      | Initial selected values (uncontrolled)           |
| value         | T[]                       | -       | Current selected values (controlled)             |
| onValueChange | (value: T[]) => void      | -       | Value change callback                            |
| disabled      | boolean                   | false   | Disable entire group                             |
| name          | string                    | -       | Form input name                                  |
| invalid       | boolean                   | false   | Error state                                      |
| className     | ClassNameValue            | -       | Custom class name                                |

### Checkbox Props

| Prop          | Type                              | Default     | Description                                      |
| ------------- | --------------------------------- | ----------- | ------------------------------------------------ |
| checked       | boolean                           | false       | Checked state (controlled)                       |
| onValueChange | (checked: boolean) => void        | -           | Checked state change callback                    |
| value         | string                            | -           | Unique identifier (required for group usage)     |
| label         | ReactNode                         | -           | Label text                                       |
| disabled      | boolean                           | false       | Disable individual checkbox                      |
| variant       | "checkbox" \| "toggle"            | "checkbox"  | Style variant                                    |
| indicator     | (checked: boolean) => ReactNode   | -           | Custom indicator render                        |
| name          | string                            | -           | Form input name                                  |
| className     | ClassNameValue                    | -           | Custom class name                                |

## CSS Classes

```css
// Toggle variant
toggle: "bg-input text-input-foreground border-y border-r first:border-l 
         has-focus-visible:ring-2 has-focus-visible:ring-ring 
         has-focus-visible:ring-offset-2 has-focus-visible:outline-none 
         has-checked:bg-primary has-checked:text-primary-foreground 
         group-data-invalid:text-destructive 
         group-data-invalid:has-checked:bg-destructive 
         group-data-invalid:accent-destructive 
         group-data-invalid:ring-destructive"

// Checkbox variant
checkbox: "group-data-invalid:text-destructive group-data-invalid:accent-destructive"

// Indicator
Checkbox.IndicatorClass: "peer-focus-visible:ring-2 peer-focus-visible:ring-ring 
                          peer-focus-visible:outline-none 
                          peer-focus-visible:ring-offset-2"
```
