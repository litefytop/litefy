"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface UploadItem {
  uid: string;
  file: File;
  signal: AbortSignal;
}

export type UploadRejectReason = "accept" | "maxSize" | "maxCount";

export interface UploadReject {
  file: File;
  reason: UploadRejectReason;
  message: string;
}

export interface UploadActions {
  remove: (uid: string) => void;
  clear: () => void;
}

export interface UploadRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function UploadRoot({ className, ...props }: UploadRootProps) {
  return <div {...props} className={cn("relative", className)} />;
}

export interface UploadDropzoneProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function UploadDropzone({ className, ...props }: UploadDropzoneProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-6 py-8 text-center text-sm cursor-pointer transition-colors",
        "hover:border-primary/50 hover:bg-muted/50",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
        "data-dragging:border-primary data-dragging:bg-primary/5",
        "data-invalid:border-destructive data-invalid:bg-destructive/5",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
    />
  );
}

export interface UploadHiddenInputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: ClassNameValue;
}

export function UploadHiddenInput({ className, ...props }: UploadHiddenInputProps) {
  return <input {...props} type="file" className={cn("sr-only", className)} />;
}

export interface UploadClassNames {
  root?: ClassNameValue;
  dropzone?: ClassNameValue;
  hiddenInput?: ClassNameValue;
}

export interface UploadStyles {
  root?: React.CSSProperties;
  dropzone?: React.CSSProperties;
  hiddenInput?: React.CSSProperties;
}

export interface UploadProps {
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  maxSize?: number;
  disabled?: boolean;
  invalid?: boolean;
  children?: React.ReactNode;
  onFilesAccepted?: (items: UploadItem[]) => void;
  onFilesRejected?: (rejects: UploadReject[]) => void;
  onFileRemove?: (uid: string) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  actionsRef?: React.Ref<UploadActions>;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: UploadClassNames;
  styles?: UploadStyles;
}

let uidSeed = 0;

export function Upload({
  accept,
  multiple = false,
  maxCount,
  maxSize,
  disabled = false,
  invalid,
  children,
  onFilesAccepted,
  onFilesRejected,
  onFileRemove,
  onDragEnter,
  onDragLeave,
  actionsRef,
  className,
  style,
  classNames,
  styles,
}: UploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const controllersRef = React.useRef(new Map<string, AbortController>());
  const dragDepthRef = React.useRef(0);
  const [dragging, setDragging] = React.useState(false);
  const callbacksRef = React.useRef({
    accept,
    multiple,
    maxCount,
    maxSize,
    onFilesAccepted,
    onFilesRejected,
    onFileRemove,
    onDragEnter,
    onDragLeave,
  });
  callbacksRef.current = {
    accept,
    multiple,
    maxCount,
    maxSize,
    onFilesAccepted,
    onFilesRejected,
    onFileRemove,
    onDragEnter,
    onDragLeave,
  };

  const matchesAccept = (file: File, accept?: string) => {
    if (!accept) return true;
    return accept.split(",").some((rule) => {
      const pattern = rule.trim().toLowerCase();
      if (!pattern) return false;
      if (pattern.startsWith(".")) return file.name.toLowerCase().endsWith(pattern);
      if (pattern.endsWith("/*")) return file.type.toLowerCase().startsWith(pattern.slice(0, -1));
      return file.type.toLowerCase() === pattern;
    });
  };

  const validate = (files: File[]) => {
    const options = callbacksRef.current;
    const remaining =
      options.maxCount === undefined
        ? Number.POSITIVE_INFINITY
        : Math.max(0, options.maxCount - controllersRef.current.size);
    const items: UploadItem[] = [];
    const rejects: UploadReject[] = [];
    const candidates = options.multiple ? files : files.slice(0, 1);
    for (const file of candidates) {
      if (!matchesAccept(file, options.accept)) {
        rejects.push({ file, reason: "accept", message: `File type not allowed: ${file.name}` });
        continue;
      }
      if (options.maxSize !== undefined && file.size > options.maxSize) {
        rejects.push({ file, reason: "maxSize", message: `File exceeds max size: ${file.name}` });
        continue;
      }
      if (items.length >= remaining) {
        rejects.push({
          file,
          reason: "maxCount",
          message: `Exceeds max count of ${options.maxCount}: ${file.name}`,
        });
        continue;
      }
      const uid = `upload-${++uidSeed}`;
      const controller = new AbortController();
      controllersRef.current.set(uid, controller);
      items.push({ uid, file, signal: controller.signal });
    }
    if (items.length > 0) options.onFilesAccepted?.(items);
    if (rejects.length > 0) options.onFilesRejected?.(rejects);
  };

  const remove = (uid: string) => {
    controllersRef.current.get(uid)?.abort();
    controllersRef.current.delete(uid);
    callbacksRef.current.onFileRemove?.(uid);
  };

  const clear = () => {
    for (const controller of controllersRef.current.values()) controller.abort();
    controllersRef.current.clear();
  };

  React.useEffect(() => {
    return () => {
      for (const controller of controllersRef.current.values()) controller.abort();
      controllersRef.current.clear();
    };
  }, []);

  React.useImperativeHandle(actionsRef, () => ({ remove, clear }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validate(Array.from(e.target.files ?? []));
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setDragging(true);
    callbacksRef.current.onDragEnter?.(e);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setDragging(false);
      callbacksRef.current.onDragLeave?.(e);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    dragDepthRef.current = 0;
    setDragging(false);
    validate(Array.from(e.dataTransfer.files));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <UploadRoot
      data-invalid={invalid || undefined}
      className={cn(className, classNames?.root)}
      style={{ ...style, ...styles?.root }}
    >
      <UploadHiddenInput
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        tabIndex={-1}
        aria-hidden
        className={classNames?.hiddenInput}
        style={styles?.hiddenInput}
      />
      <UploadDropzone
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-invalid={invalid}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onClick={() => inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={classNames?.dropzone}
        style={styles?.dropzone}
      >
        {children ?? (
          <>
            <span className="font-medium">Click to upload or drag and drop</span>
            <span className="text-xs text-muted-foreground">
              Files are validated locally before acceptance
            </span>
          </>
        )}
      </UploadDropzone>
    </UploadRoot>
  );
}
