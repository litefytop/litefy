---
title: Dialog
description: A modal dialog component for displaying content overlaying the page
---

# Dialog

A modal dialog component for displaying content overlaying the page.

## Usage

### Basic Dialog

```tsx
import { Button, Dialog } from "@/component";

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button variant="outline" onClick={() => dialogRef.current?.showModal()}>
        Open Dialog
      </Button>
      <Dialog ref={dialogRef}>
        <h2 className="text-lg font-semibold mb-2">Dialog Title</h2>
        <p className="text-sm text-muted-foreground">
          Dialog content goes here
        </p>
      </Dialog>
    </>
  );
}
```

## API Reference

### Dialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | Dialog content |
| className | ClassNameValue | - | Custom class name (string \| string[] \| boolean \| null \| undefined \| Record<string, string \| string[]>) |

### Inherited Props

Also supports all native `<dialog>` element props:

- `open` - Controls dialog visibility
- `onClose` - Dialog close event handler
- `onCancel` - Dialog cancel event handler
- etc.
