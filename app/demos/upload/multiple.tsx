"use client";

import * as React from "react";
import { Upload, type UploadItem, type UploadReject } from "@/ui";

export default function UploadMultipleDemo() {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const [rejects, setRejects] = React.useState<UploadReject[]>([]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Upload
        multiple
        accept="image/*,.pdf"
        maxCount={4}
        maxSize={1024 * 1024}
        onFilesAccepted={(accepted) => setItems((prev) => [...prev, ...accepted])}
        onFilesRejected={setRejects}
      />
      <p className="text-sm text-muted-foreground">
        Accepted: {items.length} · Rejected: {rejects.length} · Images and PDF up to 1 MB, max 4
        files
      </p>
    </div>
  );
}
