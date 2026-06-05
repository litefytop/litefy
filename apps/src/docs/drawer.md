## Installation

```tsx
import { Drawer } from "@/component/ui/drawer";
```

## Usage

### Basic Drawer

```tsx
import { Button, Drawer, DrawerRef } from "@/component";

function App() {
  const drawerRef = useRef<DrawerRef>(null);

  return (
    <>
      <Button variant="outline" onClick={() => drawerRef.current?.show()}>
        Open Drawer
      </Button>
      <Drawer ref={drawerRef}>
        <h2 className="text-lg font-semibold mb-2">Drawer Title</h2>
        <p className="text-sm text-muted-foreground">
          Drawer content goes here
        </p>
      </Drawer>
    </>
  );
}
```

## API Reference

### DrawerRef

| Prop | Type | Description |
|------|------|-------------|
| show | () => void | Open the drawer |
| close | () => void | Close the drawer |

### Drawer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placement | "left" \| "right" \| "top" \| "bottom" | "right" | Drawer placement |
| className | ClassNameValue | - | Custom class name |
