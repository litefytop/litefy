import { Upload } from "@/component/ui/upload";

export function UploadBasic() {
  return (
    <Upload
      className="w-3xs"
      label="Upload File"
      description="Select a file to upload"
    />
  );
}
