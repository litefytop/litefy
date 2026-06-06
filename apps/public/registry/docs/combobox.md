

## Usage

```tsx
import { Combobox } from "@/component";
```

## Examples

### Basic

```tsx
<Combobox options={["Apple", "Banana", "Cherry"]} />
```

### Async Search

```tsx
<Combobox
  options={async (keyword) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ["React", "Vue", "Angular", "Svelte"].filter((item) =>
      item.toLowerCase().includes(keyword.toLowerCase())
    );
  }}
/>
```

### Disabled & Invalid

```tsx
<div className="space-y-4">
  <Combobox
    options={["Option 1", "Option 2", "Option 3"]}
    disabled
    placeholder="Disabled"
  />
  <Combobox
    options={["Option 1", "Option 2", "Option 3"]}
    invalid
    placeholder="Invalid"
  />
</div>
```

### Clearable

```tsx
<Combobox
  options={["Option 1", "Option 2", "Option 3"]}
  defaultValue="Option 1"
  clearable
/>
```

## API Reference

### Combobox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | string | - | Controlled mode value |
| defaultValue | string | - | Uncontrolled mode initial value |
| onChange | (e: ComboboxChangeEvent) => void | - | Value change callback |
| onBlur | React.FocusEventHandler<HTMLInputElement> | - | Blur callback |
| onSelect | (option: string) => void | - | Option selection callback |
| options | string[] \| ((keyword: string) => Promise<string[]>) | - | Options array or async fetch function |
| placeholder | string | "Search or type..." | Placeholder text |
| disabled | boolean | false | Whether disabled |
| invalid | boolean | false | Whether invalid state |
| clearable | boolean | true | Whether show clear button |
| debounceMs | number | 300 | Debounce delay in milliseconds |
| skeleton | React.ReactNode | - | Custom loading skeleton |
| optionHeight | number | 36 | Option item height in pixels |
| overscan | number | 2 | Virtual scrolling overscan count |
| slotProps | ComboboxSlotProps | - | Internal element props pass-through |

### slotProps Config

| Prop | Type | Description |
|------|------|-------------|
| container | Omit<React.ComponentProps<"div">, "ref"> | Container div element props |
| input | Omit<React.ComponentProps<"input">, "ref" \| "value" \| ...> | Input element props |
| list | Omit<React.ComponentProps<"ul">, "ref"> | Dropdown list ul element props |
| option | React.ComponentProps<"li"> | Option li element props |
| clearButton | React.ComponentProps<"button"> | Clear button element props |
