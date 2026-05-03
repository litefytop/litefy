# Customization & Theming

Components reference semantic CSS variable tokens. Change the variables to change every component.

## How It Works

1. CSS variables defined per theme via `[data-theme="name"]` selector (light mode) and `[data-theme="name"] .dark` (dark mode).
2. Tailwind v4 maps them to utilities via `@theme inline` block.
3. Components use these utilities — changing a variable changes all components that reference it.

## Color Variables

Every color follows the `name` / `name-foreground` convention.

| Variable | Purpose |
| -------- | ------- |
| `--background` / `--foreground` | Page background and default text |
| `--card` / `--card-foreground` | Card surfaces |
| `--primary` / `--primary-foreground` | Primary buttons and actions |
| `--secondary` / `--secondary-foreground` | Secondary buttons |
| `--muted` / `--muted-foreground` | Muted backgrounds and text |
| `--accent` / `--accent-foreground` | Hover and accent states |
| `--destructive` / `--destructive-foreground` | Error/danger actions |
| `--border` | Default border color |
| `--input` | Form input borders |
| `--ring` | Focus ring color |
| `--radius` | Global border radius |

### Additional Variables (Sidebar)

| Variable | Purpose |
| -------- | ------- |
| `--sidebar-background` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Sidebar primary color |
| `--sidebar-primary-foreground` | Sidebar primary text |
| `--sidebar-accent` | Sidebar accent color |
| `--sidebar-accent-foreground` | Sidebar accent text |

## Theme System

We use `data-theme` attribute for theme switching and `.dark` class for color scheme.

### Available Themes

```tsx
const themes = [
  "zinc", "slate", "stone", "gray", "neutral",  // Neutral themes
  "red", "rose", "orange", "green", "blue",      // Colored themes
  "yellow", "violet"
];
```

### Theme Color Rules

Each theme has consistent color rules:

| Token | Light Mode | Dark Mode |
| ----- | ---------- | ---------- |
| `--primary` | theme-400 | theme-600 |
| `--accent` | theme-500 | theme-400 |
| `--ring` | theme-600 | theme-400 |
| `--destructive` | red-600 | red-400 |

## Dark Mode

Dark mode is controlled by adding `.dark` class to the root element:

```css
[data-theme="blue"] {
  --background: oklch(1 0 0);
  /* ...light mode colors */
}

[data-theme="blue"] .dark {
  --background: oklch(0.145 0 0);
  /* ...dark mode colors */
}
```

## Theme Provider

Use `ThemeProvider` to manage theme state:

```tsx
import { ThemeProvider, useTheme } from "@/component/theme";

function App() {
  return (
    <ThemeProvider defaultTheme="blue" defaultColorScheme="light">
      <YourApp />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { theme, colorScheme, setTheme, toggleColorScheme } = useTheme();
  
  return (
    <button onClick={toggleColorScheme}>
      {colorScheme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

## CSS Variables Location

Theme variables are defined in:
```
src/assets/styles/valuable.css
```

## OKLCH Color Format

Colors use OKLCH format: `oklch(lightness chroma hue)`

- **Lightness**: 0-1 (0 = black, 1 = white)
- **Chroma**: 0 = gray, higher = more saturated
- **Hue**: 0-360 degrees (0/360 = red, 120 = green, 240 = blue)

```css
/* Example: blue-500 equivalent */
--primary: oklch(0.705 0.015 286.067);
```

## Adding Custom Themes

Add a new theme selector in `valuable.css`:

```css
[data-theme="custom"] {
  --primary: oklch(0.6 0.2 280);
  --primary-foreground: oklch(0.98 0 0);
  /* ...other variables */
}

[data-theme="custom"] .dark {
  --primary: oklch(0.7 0.15 280);
  /* ...dark mode variables */
}
```

## Border Radius

`--radius` controls border radius globally:

```css
--radius: 0.625rem;  /* 10px = rounded-lg */
```

Components use: `rounded-lg` (var(--radius)), `rounded-md` (calc(var(--radius) - 2px))

## Customizing Components

### 1. Built-in variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
```

### 2. Tailwind classes via className

```tsx
<Button className="rounded-full px-8">Custom</Button>
```

### 3. Add a new variant

Edit the component source to add a variant:

```tsx
// src/components/ui/button.tsx
warning: "bg-warning text-warning-foreground hover:bg-warning/90",
```
