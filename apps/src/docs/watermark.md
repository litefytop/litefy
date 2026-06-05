# Watermark

A watermark component that overlays semi-transparent text patterns on content.

## Installation

```bash
pnpm add shadcn-ui
```

## Usage

```tsx
import { Watermark } from "@/component/ui/watermark";

<Watermark text="Confidential">
  <div>Content</div>
</Watermark>
```

## API

### WatermarkProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | - | Watermark text content |
| `fontSize` | `number` | `16` | Font size of watermark text |
| `color` | `string` | `rgba(0, 0, 0, 0.3)` | Color of watermark text |
| `fontFamily` | `string` | `sans-serif` | Font family of watermark text |
| `rotate` | `number` | `-30` | Rotation angle in degrees |
| `gap` | `number` | `100` | Spacing between watermarks |
| `opacity` | `number` | `0.3` | Opacity of watermark |
| `zIndex` | `number` | `10` | Z-index of watermark layer |
| `className` | `ClassNameValue` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Content to be watermarked |
