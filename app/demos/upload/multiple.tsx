import { Upload } from "@/ui";

export default function UploadMultipleDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Upload accept="image/*" />
      <Upload accept=".pdf,.doc,.docx" multiple />
    </div>
  );
}
