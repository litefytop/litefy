"use client";

import * as React from "react";
import { UploadDropzone, UploadHiddenInput, UploadRoot } from "@/ui";

export default function UploadCustomDemo() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [name, setName] = React.useState("");

  return (
    <UploadRoot className="w-full max-w-md">
      <UploadHiddenInput
        ref={inputRef}
        accept="image/*"
        onChange={(e) => setName(e.target.files?.[0]?.name ?? "")}
      />
      <UploadDropzone className="h-24" onClick={() => inputRef.current?.click()}>
        <span className="font-medium">{name || "Custom dropzone content"}</span>
      </UploadDropzone>
    </UploadRoot>
  );
}
