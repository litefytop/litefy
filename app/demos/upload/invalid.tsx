import { Upload } from "@/ui";

export default function UploadInvalidDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Upload invalid />
      <Upload />
    </div>
  );
}
