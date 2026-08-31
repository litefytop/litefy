import { useCallback, useEffect, useRef, useState } from "react";

export type UploadMonitorStatus = "pending" | "uploading" | "success" | "error";

export interface UploadMonitorItem {
  uid: string;
  file: File;
  status: UploadMonitorStatus;
  progress: number;
}

export interface UseUploadMonitorOptions {
  action: string;
  fieldName?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  data?: Record<string, string>;
}

export function useUploadMonitor(options: UseUploadMonitorOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [fileList, setFileList] = useState<UploadMonitorItem[]>([]);
  const xhrsRef = useRef(new Map<string, XMLHttpRequest>());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      for (const xhr of xhrsRef.current.values()) xhr.abort();
      xhrsRef.current.clear();
    };
  }, []);

  const patchItem = useCallback((uid: string, patch: Partial<UploadMonitorItem>) => {
    if (!mountedRef.current) return;
    setFileList((prev) =>
      prev.map((item) => (item.uid === uid ? { ...item, ...patch } : item)),
    );
  }, []);

  const acceptFiles = useCallback(
    (items: { uid: string; file: File; signal: AbortSignal }[]) => {
      const { action, fieldName = "file", headers, withCredentials, data } = optionsRef.current;
      for (const item of items) {
        if (xhrsRef.current.has(item.uid)) continue;
        setFileList((prev) =>
          prev.some((existing) => existing.uid === item.uid)
            ? prev
            : [...prev, { uid: item.uid, file: item.file, status: "pending", progress: 0 }],
        );
        const formData = new FormData();
        formData.append(fieldName, item.file);
        if (data) {
          for (const [key, value] of Object.entries(data)) formData.append(key, value);
        }
        const xhr = new XMLHttpRequest();
        xhrsRef.current.set(item.uid, xhr);
        xhr.open("POST", action, true);
        if (withCredentials) xhr.withCredentials = true;
        if (headers) {
          for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
          }
        }
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            patchItem(item.uid, {
              status: "uploading",
              progress: Math.round((e.loaded / e.total) * 100),
            });
          }
        };
        xhr.onload = () => {
          patchItem(
            item.uid,
            xhr.status >= 200 && xhr.status < 300
              ? { status: "success", progress: 100 }
              : { status: "error" },
          );
        };
        xhr.onerror = () => patchItem(item.uid, { status: "error" });
        xhr.onabort = () => patchItem(item.uid, { status: "error" });
        item.signal.addEventListener("abort", () => xhr.abort(), { once: true });
        xhr.send(formData);
      }
    },
    [patchItem],
  );

  const removeItem = useCallback((uid: string) => {
    xhrsRef.current.get(uid)?.abort();
    xhrsRef.current.delete(uid);
    if (mountedRef.current) {
      setFileList((prev) => prev.filter((item) => item.uid !== uid));
    }
  }, []);

  const clearAll = useCallback(() => {
    for (const xhr of xhrsRef.current.values()) xhr.abort();
    xhrsRef.current.clear();
    if (mountedRef.current) setFileList([]);
  }, []);

  return { fileList, acceptFiles, removeItem, clearAll };
}
