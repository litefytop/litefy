import { useState } from "react";
import { Upload } from "@/component/ui/upload";

export function UploadValidation() {
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

  return (
    <Upload
      className="w-3xs"
      label="Upload Image"
      description="Only JPEG, PNG, GIF (max 2MB)"
      invalid={invalid}
      onChange={handleChange}
      accept="image/*"
    />
  );
}
