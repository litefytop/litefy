

## Usage

```tsx
import { Tabs } from "@/component/ui/tabs";

function App() {
  return (
    <Tabs
      options={[
        { value: "tab1", label: "Tab 1", children: <div>Content 1</div> },
        { value: "tab2", label: "Tab 2", children: <div>Content 2</div> },
        { value: "tab3", label: "Tab 3", children: <div>Content 3</div> },
      ]}
    />
  );
}
```

## Examples

### Basic

Basic tabs with default behavior. Only one tab can be selected at a time.

```tsx
<Tabs
  options={[
    { value: "account", label: "Account", children: <div>Account settings content</div> },
    { value: "password", label: "Password", children: <div>Password settings content</div> },
    { value: "notifications", label: "Notifications", children: <div>Notification settings content</div> },
  ]}
/>
```

### Controlled Mode

Use controlled mode when you need to manage the selected tab state externally.

```tsx
const [value, setValue] = useState("tab1");

<Tabs
  value={value}
  onValueChange={setValue}
  options={[
    { value: "tab1", label: "Tab 1", children: <div>Content 1</div> },
    { value: "tab2", label: "Tab 2", children: <div>Content 2</div> },
    { value: "tab3", label: "Tab 3", children: <div>Content 3</div> },
  ]}
/>
```

### Vertical Orientation

Display tabs in a vertical layout.

```tsx
<Tabs
  orientation="vertical"
  options={[
    { value: "overview", label: "Overview", children: <div>Overview content</div> },
    { value: "analytics", label: "Analytics", children: <div>Analytics content</div> },
    { value: "reports", label: "Reports", children: <div>Reports content</div> },
  ]}
/>
```

### Manual Activation

Use manual activation mode where users need to press Enter or Space to select a tab.

```tsx
<Tabs
  activationMode="manual"
  options={[
    { value: "tab1", label: "Tab 1", children: <div>Content 1</div> },
    { value: "tab2", label: "Tab 2", children: <div>Content 2</div> },
    { value: "tab3", label: "Tab 3", children: <div>Content 3</div> },
  ]}
/>
```

### With Disabled Tabs

Some tabs can be disabled to prevent selection.

```tsx
<Tabs
  options={[
    { value: "tab1", label: "Tab 1", children: <div>Content 1</div> },
    { value: "tab2", label: "Tab 2", disabled: true, children: <div>Disabled content</div> },
    { value: "tab3", label: "Tab 3", children: <div>Content 3</div> },
  ]}
/>
```

### Custom Styling

Customize the appearance using className and slotProps.

```tsx
<Tabs
  className="max-w-lg"
  slotProps={{
    list: { className: "bg-muted/30 p-1 rounded-lg" },
    trigger: { className: "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground" },
    content: { className: "bg-card rounded-md shadow-sm" },
  }}
  options={[
    { value: "tab1", label: "Tab 1", children: <div>Content 1</div> },
    { value: "tab2", label: "Tab 2", children: <div>Content 2</div> },
  ]}
/>
```

## API Reference

### Tabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | `Array<{ value: T, label: ReactNode, children: ReactNode, disabled?: boolean }>` | - | Tab options configuration |
| defaultValue | `T` | `options[0]?.value` | Default selected tab value (uncontrolled) |
| value | `T` | - | Selected tab value (controlled) |
| onValueChange | `(value: T) => void` | - | Callback when tab selection changes |
| orientation | `"horizontal"` \| `"vertical"` | `"horizontal"` | Tab list orientation |
| activationMode | `"automatic"` \| `"manual"` | `"automatic"` | How tabs are activated |
| className | `ClassNameValue` | - | Root container className |
| slotProps | `{ list?: DivProps, trigger?: ButtonProps, content?: DivProps }` | - | Internal element props |

### slotProps

| Prop | Type | Description |
|------|------|-------------|
| list | `React.ComponentProps<"div">` | Props for the tab list container |
| trigger | `React.ComponentProps<"button">` | Props for individual tab triggers |
| content | `React.ComponentProps<"div">` | Props for tab content panels |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Left/Up | Move focus to previous tab |
| Arrow Right/Down | Move focus to next tab |
| Home | Move focus to first tab |
| End | Move focus to last tab |
| Enter/Space | Select focused tab (manual mode only) |

## CSS Classes

```css
// Root
"w-full font-sans"

// List Container
"flex items-center gap-1"
"data-[orientation=horizontal]:border-b data-[orientation=horizontal]:border-border"
"data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-r data-[orientation=vertical]:border-border"

// Tab Trigger
"px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
"text-muted-foreground hover:text-foreground hover:bg-muted/50"
"data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:shadow-sm"
"disabled:opacity-50 disabled:cursor-not-allowed"

// Content Panel
"p-4 rounded-md bg-background"
"data-[selected=false]:hidden"
```
