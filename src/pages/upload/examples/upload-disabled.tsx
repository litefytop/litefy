import { Upload } from "@/component/ui/upload";

export function UploadDisabled() {
  return (
    <Upload
      className="w-3xs"
      label="Upload File"
      description="Disabled upload"
      disabled
    />
  );
}
