---
title: Dropdown
description: A dropdown menu component for displaying actions
---

# Dropdown

A dropdown menu component for displaying actions.
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/component/ui/dropdown-menu";
import { Button } from "@/component/ui/button";

function App() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
        <DropdownMenuItem>Item 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Examples

### Basic

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Alignment

```tsx
<DropdownMenuContent alignX="start" alignY="start">
  <DropdownMenuItem>Left Top</DropdownMenuItem>
</DropdownMenuContent>

<DropdownMenuContent alignX="center" alignY="center">
  <DropdownMenuItem>Center</DropdownMenuItem>
</DropdownMenuContent>

<DropdownMenuContent alignX="end" alignY="end">
  <DropdownMenuItem>Right Bottom</DropdownMenuItem>
</DropdownMenuContent>
```

### Menu Position

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Side Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent side="left" align="start">
    <DropdownMenuItem>Left</DropdownMenuItem>
    <DropdownMenuItem>Right</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API Reference

### DropdownMenu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | ClassNameValue | - | Root element class name |
| ...divProps | React.HTMLAttributes<HTMLDivElement> | - | Inherited div element props |

### DropdownMenuTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| target | string | - | Target menu ID (optional, uses context ID by default) |
| ...buttonProps | ButtonProps | - | Inherited button component props |

### DropdownMenuContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| alignX | "start" \| "center" \| "end" | "center" | Horizontal alignment |
| alignY | "start" \| "center" \| "end" | "end" | Vertical alignment |
| popover | "auto" \| "manual" \| "hint" | "auto" | Popover behavior mode |
| id | string | - | Content container ID (optional, uses context ID by default) |
| ...menuProps | React.HTMLAttributes<HTMLMenuElement> | - | Inherited menu element props |

### DropdownMenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| disabled | boolean | false | Whether disabled |
| onClick | React.MouseEventHandler<HTMLButtonElement> | - | Click handler |
| ...buttonProps | React.ButtonHTMLAttributes<HTMLButtonElement> | - | Inherited button element props |
