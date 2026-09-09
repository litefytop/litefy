"use client";

import * as React from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { type ClassNameValue, cn } from "..";
import { Textarea } from "./text-area";

type PastedImage = { id: string; file: File; url: string };

export interface ChatInputProps
  extends Omit<React.ComponentProps<"div">, "className" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (text: string) => void;
  
  onSend?: (payload: { text: string; images: File[] }) => void;
  placeholder?: string;
  disabled?: boolean;
  
  autoPaste?: boolean;
  
  attach?: boolean;
  
  enterToSend?: "auto" | boolean;
  
  actions?: React.ReactNode;
  classNames?: {
    container?: ClassNameValue;
    textarea?: ClassNameValue;
    images?: ClassNameValue;
    actions?: ClassNameValue;
    send?: ClassNameValue;
  };
  styles?: {
    container?: React.CSSProperties;
    textarea?: React.CSSProperties;
    actions?: React.CSSProperties;
    send?: React.CSSProperties;
  };
}

function useIsCoarsePointer() {
  const [coarse, setCoarse] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return coarse;
}

export function ChatInput({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  onSend,
  placeholder,
  disabled,
  autoPaste = true,
  attach = false,
  enterToSend = "auto",
  actions,
  classNames,
  styles,
  ...props
}: ChatInputProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const text = isControlled ? controlledValue : uncontrolled;
  const [images, setImages] = React.useState<PastedImage[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const coarse = useIsCoarsePointer();

  const setText = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const addFiles = (files: File[]) => {
    setImages((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const canSend = text.trim().length > 0 || images.length > 0;

  const send = () => {
    if (disabled || !canSend) return;
    onSend?.({ text, images: images.map((img) => img.file) });
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const enterSends = enterToSend === "auto" ? !coarse : enterToSend;
    if (e.key === "Enter" && enterSends && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!autoPaste) return;
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);
    if (files.length === 0) return;
    e.preventDefault();
    addFiles(files);
  };

  return (
    <div
      {...props}
      className={cn(
        "flex w-full max-w-full flex-col gap-2 rounded-lg border bg-background p-2",
        classNames?.container,
      )}
      style={styles?.container}
    >
      {images.length > 0 && (
        <div className={cn("flex gap-2 overflow-x-auto py-1", classNames?.images)}>
          {images.map((img) => (
            <div
              key={img.id}
              className="relative size-16 shrink-0 overflow-hidden rounded-md border"
            >
              <img src={img.url} alt={img.file.name} className="size-full object-cover" />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeImage(img.id)}
                className="absolute right-0.5 top-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full bg-foreground/60 text-background hover:bg-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Textarea
        value={text}
        disabled={disabled}
        onChange={(e) => {
          setText(e.target.value);
          return undefined;
        }}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "min-h-16 resize-none border-0 px-1 shadow-none focus:ring-0",
          
          "text-base sm:text-sm",
          classNames?.textarea,
        )}
        style={styles?.textarea}
      />
      <div className="flex items-center justify-between gap-2">
        <div className={cn("flex min-w-0 items-center gap-1.5", classNames?.actions)} style={styles?.actions}>
          {attach && (
            <button
              type="button"
              aria-label="Attach image"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-foreground"
            >
              <ImagePlus className="size-4" />
            </button>
          )}
          {actions}
        </div>
        <button
          type="button"
          aria-label="Send"
          disabled={disabled || !canSend}
          onClick={send}
          className={cn(
            "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary-accent disabled:opacity-50",
            classNames?.send,
          )}
          style={styles?.send}
        >
          <Send className="size-4" />
        </button>
      </div>
      {attach && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) addFiles(files);
            e.target.value = "";
          }}
        />
      )}
    </div>
  );
}
