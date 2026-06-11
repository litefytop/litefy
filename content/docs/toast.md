---
title: Toast
description: A toast notification component for displaying brief messages
---

# Toast

A toast notification component for displaying brief messages.

## Usage

```tsx
import { Toaster } from "@/component/ui/toast";
```

## Examples

### Basic

```tsx
Toaster.success({ title: "Success" });
Toaster.error({ title: "Error" });
Toaster.warning({ title: "Warning" });
Toaster.info({ title: "Info" });
Toaster.loading({ title: "Loading..." });
```

### With Description

```tsx
Toaster.success({
  title: "Success",
  description: "Your action has been completed",
});
```

### Custom Duration

```tsx
Toaster.success({ title: "Disappear after 5s", duration: 5000 });
Toaster.success({ title: "Never auto-dismiss", duration: Infinity });
```

### Custom Icon

```tsx
Toaster.success({
  title: "Custom Icon",
  icon: <span>🎉</span>,
});
```

### Actions

```tsx
Toaster.success({
  title: "With Actions",
  actions: [
    {
      children: "View",
      onClick: (dismiss) => { ... }
    },
    {
      children: "Cancel",
      variant: "ghost",
      onClick: (dismiss) => { ... }
    }
  ]
})
```

### Position

```tsx
<Toaster position="top-right" />
<Toaster position="top-left" />
<Toaster position="top-center" />
<Toaster position="bottom-right" />
<Toaster position="bottom-left" />
<Toaster position="bottom-center" />
```

### Manual Dismiss

```tsx
const id = Toaster.loading({ title: "Loading..." });
Toaster.dismiss(id);
Toaster.dismiss(); // Dismiss all
```

### Callbacks

```tsx
Toaster.success({
  title: "With Callbacks",
  onDismiss: (toast) => {
    console.log("dismissed", toast);
  },
  onAutoClose: (toast) => {
    console.log("auto closed", toast);
  },
});
```

## Initialize Toaster

Add the `Toaster` component once in your app's root component:

```tsx
import { Toaster } from "@/component";

function App() {
  return (
    <div>
      {/* Other content */}
      <Toaster position="top-center" />
    </div>
  );
}
```

- The `Toaster` component only needs to be initialized **once** in the root component to take effect globally
- `position` is a global configuration, **do not** declare different positions in multiple places
- For example: declaring both `<Toaster position="top-center" />` and `<Toaster position="top-right" />` will cause each toast to appear twice
- Design philosophy: Fix toast position to avoid distracting users with toasts appearing in different locations

## API Reference

| Prop        | Type                                                               | Default | Description                                  |
| ----------- | ------------------------------------------------------------------ | ------- | -------------------------------------------- |
| type        | `success` \| `error` \| `warning` \| `info` \| `loading`           | -       | Toast type                                   |
| title       | `ReactNode`                                                        | -       | Title                                        |
| description | `ReactNode`                                                        | -       | Description                                  |
| icon        | `ReactNode`                                                        | -       | Custom icon                                  |
| duration    | `number`                                                           | 3000    | Duration in milliseconds, set to Infinity to never auto-dismiss |
| onDismiss   | `(toast: Toast) => void`                                           | -       | Callback when dismissed                      |
| onAutoClose | `(toast: Toast) => void`                                           | -       | Callback when auto-closed                    |
| actions     | `Array<ButtonProps & { onClick?: (dismiss: () => void) => void }>` | -       | Action buttons                               |

## Toaster Component

| Prop          | Type            | Default     | Description                    |
| ------------- | --------------- | ----------- | ------------------------------ |
| position      | `ToastPosition` | `top-right` | Toast position                 |
| visibleToasts | `number`        | 3           | Maximum number of toasts to show |
