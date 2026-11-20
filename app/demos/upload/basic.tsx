"use client";

import * as React from "react";
import { X } from "@/components/icons";
import { useUploadMonitor, type UploadActions, type UploadReject } from "@/ui";
import { Button, Progress, Upload } from "@/ui/skins";

class MockXMLHttpRequest {
  status = 0;
  withCredentials = false;
  upload = { onprogress: null as ((event: ProgressEvent) => void) | null };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private loaded = 0;
  private total = 4 * 1024 * 1024;

  open() {}
  setRequestHeader() {}
  send() {
    this.timer = setInterval(() => {
      this.loaded = Math.min(this.loaded + this.total / 25, this.total);
      this.upload.onprogress?.({
        lengthComputable: true,
        loaded: this.loaded,
        total: this.total,
      } as ProgressEvent);
      if (this.loaded >= this.total) this.finish();
    }, 120);
  }
  abort() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.onabort?.();
  }
  private finish() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.status = 200;
    this.onload?.();
  }
}

export default function UploadBasicDemo() {
  const actionsRef = React.useRef<UploadActions | null>(null);
  const [rejects, setRejects] = React.useState<UploadReject[]>([]);
  const upload = useUploadMonitor({ action: "mock://upload" });

  React.useEffect(() => {
    const Original = window.XMLHttpRequest;
    window.XMLHttpRequest = MockXMLHttpRequest as unknown as typeof XMLHttpRequest;
    return () => {
      window.XMLHttpRequest = Original;
    };
  }, []);

  const openPreview = (item: (typeof upload.fileList)[number]) => {
    const url = URL.createObjectURL(item.file);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <div className="flex flex-col gap-3 mx-auto">
      <Upload
        multiple
        accept="image/*,.pdf"
        maxCount={5}
        maxSize={2 * 1024 * 1024}
        actionsRef={actionsRef}
        onFilesAccepted={upload.acceptFiles}
        onFilesRejected={setRejects}
        onFileRemove={upload.removeItem}
      />

      {rejects.length > 0 && (
        <ul>
          {rejects.map((reject) => (
            <li key={reject.message}>{reject.message}</li>
          ))}
        </ul>
      )}

      {upload.fileList.length === 0 ? (
        <div>No files</div>
      ) : (
        <ul className="m-0 list-none p-0">
          {upload.fileList.map((item) => (
            <li key={item.uid} className="flex items-center gap-x-3 border-b-hair border-border py-2 last:border-b-0">
              {item.status === "uploading" ? (
                <Progress
                  aria-label={`Uploading ${item.file.name}`}
                  current={item.progress}
                  className="flex-1"
                />
              ) : (
                <Button
                  data-variant="text"
                  className="flex-1 justify-start"
                  onClick={() => openPreview(item)}
                >
                  {item.file.name}
                </Button>
              )}
              <Button
                data-variant="text"
                icon={<X />}
                aria-label={`Remove ${item.file.name}`}
                onClick={() => actionsRef.current?.remove(item.uid)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
