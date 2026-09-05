"use client";
import { ImageRoot, ImageImage } from "@/ui";

export default function ImageAtomicDemo() {
  return (
    <ImageRoot className="w-40 h-40 rounded-md overflow-hidden">
      <ImageImage
        src="https://picsum.photos/seed/img1/320/320"
        alt="demo image"
      />
    </ImageRoot>
  );
}
