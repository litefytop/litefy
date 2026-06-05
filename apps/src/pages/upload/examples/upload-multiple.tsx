import { useState } from "react";
import { Upload } from "@/component/ui/upload";

export function UploadMultiple() {
  const [fileList, setFileList] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const names = Array.from(files).map((f) => f.name);
    setFileList(names);
  };

  return (
    <div className="space-y-2">
      <Upload
        className="w-3xs"
        onChange={handleChange}
        multiple
      />
      {fileList.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p>Selected files:</p>
          <ul className="list-disc list-inside">
            {fileList.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
