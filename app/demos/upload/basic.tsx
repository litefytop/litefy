"use client";

import * as React from "react";
import { List, Upload, useUploadMonitor, type UploadActions, type UploadReject } from "@/ui";

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
      this.onabort?.();
    }
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

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Upload
        multiple
        maxCount={5}
        maxSize={2 * 1024 * 1024}
        actionsRef={actionsRef}
        onFilesAccepted={upload.acceptFiles}
        onFilesRejected={setRejects}
        onFileRemove={upload.removeItem}
      />

      {rejects.length > 0 && (
        <ul className="space-y-1 text-sm text-destructive">
          {rejects.map((reject, index) => (
            <li key={index}>{reject.message}</li>
          ))}
        </ul>
      )}
      <List
        className="max-h-48"
        items={upload.fileList}
        getKey={(item) => item.uid}
        empty={
          <div className="px-3 py-4 text-center text-muted-foreground">No files</div>
        }
        renderItem={(item) => (
          <>
            <span className="flex-1 truncate">{item.file.name}</span>
            <span className="w-24 text-right text-muted-foreground">
              {item.status === "uploading" ? `${item.progress}%` : item.status}
            </span>
            <button
              type="button"
              className="text-destructive hover:underline"
              onClick={() => actionsRef.current?.remove(item.uid)}
            >
              Remove
            </button>
          </>
        )}
      />
    </div>
  );
}
