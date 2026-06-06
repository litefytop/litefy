

## Usage

```tsx
import { Upload } from "@/component/ui/upload";

function App() {
  return <Upload label="Upload File" />;
}
```

## Examples

### Basic

```tsx
<Upload
  label="Upload File"
  description="Select a file to upload"
/>
```

### Validation

Use `onChange` to implement custom validation logic. Return `{ invalid: "error message" }` to trigger invalid state.

```tsx
const [invalid, setInvalid] = useState<string>();

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    setInvalid("File size must be less than 2MB");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    setInvalid("Only JPEG, PNG and GIF files are allowed");
    return;
  }

  setInvalid(undefined);
};

<Upload
  label="Upload Image"
  description="Only JPEG, PNG, GIF (max 2MB)"
  invalid={invalid}
  onChange={handleChange}
  accept="image/*"
/>
```

### Multiple

```tsx
const [fileList, setFileList] = useState<string[]>([]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const names = Array.from(files).map((f) => f.name);
  setFileList(names);
};

<Upload
  label="Upload Multiple Files"
  description="Select multiple files"
  onChange={handleChange}
  multiple
/>
```

### Disabled

```tsx
<Upload
  label="Upload File"
  description="Disabled upload"
  disabled
/>
```
