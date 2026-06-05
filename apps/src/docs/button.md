## Installation

```bash
npm install @your-org/ui
```

## Usage

```tsx
import { Button } from "@/component/ui/button";

function App() {
  return <Button>Click me</Button>;
}
```

## Examples

### Basic

```tsx
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
```

### Disabled

```tsx
<Button disabled>Disabled</Button>
```

### Loading

```tsx
<Button loading={{ loading: true }}>Loading</Button>
```

### Icon Button

```tsx
<Button variant="ghost">
  <Icon className="size-4" />
</Button>
```

### With Icon

```tsx
<Button>
  <Icon className="size-4 mr-2" />
  With Icon
</Button>
```

## CSS Classes

```css
// Base
base:"cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none
focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"

// Variant
primary: "bg-primary text-primary-foreground hover:bg-primary/90"
destructive: "bg-destructive text-white hover:bg-destructive/90"
secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
outline: "border border-primary bg-transparent hover:bg-accent hover:text-accent-foreground"
ghost: "hover:bg-muted hover:text-muted-foreground"
link: "text-primary underline-offset-4 hover:underline"
text: "text-primary hover:text-primary/80"

// Icon
[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0
```

## API Reference

| Prop          | Type                                                                        | Default   | Description                                                                   |
| ------------- | --------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------- |
| variant       | "primary" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "text" | "primary" | Button style variant                                                          |
| className     | ClassNameValue                                                              | -         | `string\|string[]\|boolean\|null\|undefined\|Record<string,string\|string[]>` |
| loadingConfig | ButtonLoadingConfig                                                         | -         | Loading configuration                                                         |

### loadingConfig

| Prop      | Type           | Default | Description                                                                   |
| --------- | -------------- | ------- | ----------------------------------------------------------------------------- |
| loading   | boolean        | false   | Show loading state                                                            |
| icon      | ReactNode      | -       | Custom loading icon                                                           |
| className | ClassNameValue | -       | `string\|string[]\|boolean\|null\|undefined\|Record<string,string\|string[]>` |
