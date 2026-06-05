## Installation

```bash
npm install @your-org/ui
```

## Usage

```tsx
import { Pagination } from "@/component";

function App() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={100}
      onChange={(page, size) => {
        setCurrent(page);
        setPageSize(size);
      }}
    >
      <Pagination.Description />
      <Pagination.Controls>
        <Pagination.Sizer />
        <button onClick={() => goFirst()}>First</button>
        <button onClick={() => goPrev()}>Prev</button>
        <button onClick={() => goNext()}>Next</button>
        <button onClick={() => goLast()}>Last</button>
      </Pagination.Controls>
    </Pagination>
  );
}
```

## Examples

### Basic

```tsx
<Pagination
  current={current}
  pageSize={pageSize}
  total={100}
  onChange={(page, size) => {
    setCurrent(page);
    setPageSize(size);
  }}
>
  <Pagination.Description />
  <Pagination.Controls>
    <Pagination.Sizer />
    <button onClick={() => goFirst()}>First</button>
    <button onClick={() => goPrev()}>Prev</button>
    <button onClick={() => goNext()}>Next</button>
    <button onClick={() => goLast()}>Last</button>
  </Pagination.Controls>
</Pagination>
```

### Custom Page Size

```tsx
<Pagination
  current={current}
  pageSize={pageSize}
  total={200}
  onChange={(page, size) => {
    setCurrent(page);
    setPageSize(size);
  }}
>
  <Pagination.Description />
  <Pagination.Controls>
    <Pagination.Sizer options={[5, 20, 50, 100]} />
    {/* buttons */}
  </Pagination.Controls>
</Pagination>
```

### Custom Text

```tsx
<Pagination
  current={current}
  pageSize={pageSize}
  total={85}
  onChange={(page, size) => {
    setCurrent(page);
    setPageSize(size);
  }}
>
  <Pagination.Description
    format={(total, current, totalPages) =>
      `共 ${total} 条记录，当前第 ${current} / ${totalPages} 页`
    }
  />
  <Pagination.Controls>
    <Pagination.Sizer format={(size) => `${size} 条/页`} />
    {/* buttons */}
  </Pagination.Controls>
</Pagination>
```

### Custom Icons

```tsx
const { goFirst, goPrev, goNext, goLast } = Pagination.use();

<button onClick={goFirst}>
  <SkipBack className="size-4" />
</button>
<button onClick={goPrev}>
  <StepBack className="size-4" />
</button>
<button onClick={goNext}>
  <StepForward className="size-4" />
</button>
<button onClick={goLast}>
  <SkipForward className="size-4" />
</button>
```

### With Actions

```tsx
<Pagination
  current={current}
  pageSize={pageSize}
  total={100}
  onChange={(page, size) => {
    setCurrent(page);
    setPageSize(size);
  }}
>
  <Pagination.Description />
  <Pagination.Controls>
    <Pagination.Sizer />
    <div className="flex gap-2">
      <Button variant="ghost" iconOnly>
        <RefreshCw className="size-4" />
      </Button>
      <Button variant="ghost" iconOnly>
        <Download className="size-4" />
      </Button>
    </div>
    {/* buttons */}
  </Pagination.Controls>
</Pagination>
```

## CSS Classes

```css
// Root
root: "flex items-center justify-between px-4 py-3"

// Description
description: "text-sm text-muted-foreground"

// Sizer
sizer: "h-9 w-28 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"

// Controls
controls: "flex items-center gap-2"

// Button (custom)
button: "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none size-8 rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
```

## API Reference

### Pagination Props

| Prop      | Type                   | Default | Description                  |
| --------- | ---------------------- | ------- | ---------------------------- |
| current   | number                 | 1       | Current page number          |
| pageSize  | number                 | 10      | Number of items per page    |
| total     | number                 | 0       | Total number of items       |
| onChange  | (current, pageSize) => void | -   | Callback when page changes  |
| className | ClassNameValue         | -       | Additional class names       |
| children  | ReactNode              | -       | Child elements              |

### Pagination.Description

| Prop   | Type     | Description                    |
| ------ | -------- | ------------------------------ |
| format | (total, current, totalPages) => string | Custom format function |

### Pagination.Sizer

| Prop    | Type     | Default          | Description              |
| ------- | -------- | ---------------- | ---------------------- |
| options | number[] | [10, 20, 50, 100] | Page size options     |
| format  | (size) => string | - | Custom format function |

### Pagination.Controls

| Prop      | Type     | Description              |
| --------- | -------- | ---------------------- |
| children  | ReactNode | Control button elements |

### Pagination.use()

Returns pagination context with the following properties:

| Property    | Type       | Description              |
| ----------- | ---------- | ---------------------- |
| current     | number     | Current page number     |
| pageSize    | number     | Items per page          |
| total       | number     | Total items             |
| totalPages  | number     | Total pages             |
| goTo        | (page) => void | Navigate to page    |
| goPrev      | () => void  | Go to previous page    |
| goNext      | () => void  | Go to next page        |
| goFirst     | () => void  | Go to first page       |
| goLast      | () => void  | Go to last page        |
| setPageSize | (size) => void | Set page size     |
