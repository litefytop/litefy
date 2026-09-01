"use client";

import * as React from "react";
import { Brain, Globe, Send, X } from "lucide-react";
import { Button, Textarea, Toggle } from "@/ui";

type PastedImage = {
  id: string;
  file: File;
  url: string;
};

export default function ChatInputDemo() {
  const [text, setText] = React.useState("");
  const [images, setImages] = React.useState<PastedImage[]>([]);
  const [deepThink, setDeepThink] = React.useState(false);
  const [webSearch, setWebSearch] = React.useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    return undefined;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);
    if (files.length === 0) return;
    e.preventDefault();
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

  const handleSend = () => {
    if (!text.trim() && images.length === 0) return;
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setText("");
  };

  const canSend = text.trim().length > 0 || images.length > 0;

  return (
    <div className="flex w-96 max-w-full flex-col gap-2 rounded-lg border bg-background p-2">
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-1">
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
        onChange={handleTextChange}
        onPaste={handlePaste}
        placeholder="输入消息，粘贴截图试试…"
        className="min-h-16 resize-none border-0 px-1 shadow-none focus:ring-0"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Toggle
            checked={deepThink}
            onCheckedChange={setDeepThink}
            className="px-2.5 py-1 text-xs"
          >
            <Brain />
            深度思考
          </Toggle>
          <Toggle
            checked={webSearch}
            onCheckedChange={setWebSearch}
            className="px-2.5 py-1 text-xs"
          >
            <Globe />
            联网搜索
          </Toggle>
        </div>
        <Button onClick={handleSend} disabled={!canSend}>
          <Send />
          Send
        </Button>
      </div>
    </div>
  );
}
