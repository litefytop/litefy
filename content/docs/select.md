---
title: Select
description: A select dropdown component for choosing options
---

# Select

A select dropdown component for choosing options.
import { Select } from "@/component";

function App() {
  return (
    <Select
      options={[
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
      ]}
      placeholder="Select an option"
    />
  );
}
```

## Examples

### Basic

```tsx
<Select
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ]}
  placeholder="Select an option"
/>
```

### Controlled

```tsx
const [value, setValue] = useState("");

<Select
  value={value}
  onChange={(e) => setValue(e.target.value)}
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ]}
  placeholder="Select an option"
/>
```

### Validation

```tsx
const [invalid, setInvalid] = useState<string>();

<Select
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
  ]}
  placeholder="Select with validation"
  label="Required"
  invalid={invalid}
  onChange={(e) => {
    if (e.target.value === "2") {
      setInvalid("Option 2 is not allowed");
    } else {
      setInvalid(undefined);
    }
  }}
/>
```

### Disabled

```tsx
<Select
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ]}
  placeholder="Disabled"
  disabled
/>
```

### Group

```tsx
<Select
  options={[
    {
      group: "Group A",
      options: [
        { label: "Option A1", value: "a1" },
        { label: "Option A2", value: "a2" },
      ],
    },
    {
      group: "Group B",
      options: [
        { label: "Option B1", value: "b1" },
        { label: "Option B2", value: "b2" },
      ],
    },
  ]}
  placeholder="Select from group"
/>
```

### Multiple

```tsx
const [value, setValue] = useState<string[]>([]);

<Select
  options={[
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
    { label: "Option 3", value: "3" },
    { label: "Option 4", value: "4" },
    { label: "Option 5", value: "5" },
  ]}
  multiple
  value={value}
  onChange={(e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setValue(selected);
  }}
/>
```

## API Reference

### Select Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | - | Current selected value |
| defaultValue | string | - | Initial selected value |
| onChange | (e: ChangeEvent) => void \| { invalid?: string } | - | Change event handler |
| options | { label: string; value: string }[] \| { group: string; options: SelectOption[] }[] | - | Select options (flat or grouped) |
| placeholder | string | - | Placeholder text |
| disabled | boolean | false | Whether disabled |
| multiple | boolean | false | Whether multiple selection |
| invalid | ReactNode | - | Error message |
| label | ReactNode | - | Label text |
| description | ReactNode | - | Description text |
| leading | ReactNode | - | Leading content |
| trailing | ReactNode | - | Trailing content |
| slotProps | SelectItemProps | - | Internal element props |

### SelectItemProps

| Prop | Type | Description |
|------|------|-------------|
| group | React.ComponentProps<"div"> | Group container props |
| label | React.ComponentProps<"label"> | Label element props |
| invalid | React.ComponentProps<"div"> | Invalid message props |
| description | React.ComponentProps<"small"> | Description element props |
| leading | React.ComponentProps<"span"> | Leading element props |
| trailing | React.ComponentProps<"span"> | Trailing element props |
