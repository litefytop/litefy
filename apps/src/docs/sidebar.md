

## Usage

```tsx
import { useRef } from "react";
import { Sidebar, Button } from "@/component";
import { SidebarHandle } from "@/component/ui/sidebar";

function App() {
  const sidebarRef = useRef<SidebarHandle>(null);

  return (
    <div className="flex">
      <Sidebar ref={sidebarRef} defaultOpen={true}>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
        </nav>
      </Sidebar>
      <main>
        <Button onClick={() => sidebarRef.current?.toggle()}>
          Toggle Sidebar
        </Button>
      </main>
    </div>
  );
}
```

## Examples

### Basic

```tsx
const sidebarRef = useRef<SidebarHandle>(null);

<Sidebar ref={sidebarRef} defaultOpen={true}>
  <nav>...</nav>
</Sidebar>

<Button onClick={() => sidebarRef.current?.toggle()}>
  Toggle
</Button>
<Button onClick={() => sidebarRef.current?.open()}>
  Open
</Button>
<Button onClick={() => sidebarRef.current?.close()}>
  Close
</Button>
```

## CSS Classes

```css
// Root
root: "transition-all duration-300"

// Collapsed state
collapsed: "w-0 overflow-hidden"

// Expanded state (when className is provided)
expanded: className
```

## API Reference

### Sidebar Props

| Prop        | Type            | Default | Description                   |
| ----------- | --------------- | ------- | ----------------------------- |
| defaultOpen | boolean        | true    | Default open state             |
| className  | ClassNameValue | -       | Additional class names         |
| children    | ReactNode      | -       | Sidebar content               |
| ref         | Ref<SidebarHandle> | -   | Ref to access control methods |

### SidebarHandle

| Prop    | Type       | Description              |
| ------- | ---------- | ---------------------- |
| toggle  | () => void | Toggle sidebar state   |
| open    | () => void | Open sidebar           |
| close   | () => void | Close sidebar          |
| isOpen  | boolean    | Current open state     |
