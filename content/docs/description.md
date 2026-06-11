---
title: Description
description: A description component for displaying helper text
---

# Description

A description component for displaying helper text.
import { Description } from "@/component/ui/description";

function App() {
  return (
    <Description>
      This is a description text.
    </Description>
  );
}
```

## Examples

### Basic

```tsx
<Description>
  This is a description text that provides additional information.
</Description>
```

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Content |
| className | ClassNameValue | - | Custom style |
| ...HTMLSmallElementProps | HTMLSmallElementProps | - | Other props inherited from small element |
