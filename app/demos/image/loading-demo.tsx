"use client";

import { Image } from "@/components/ui";

export default function ImageLoadingDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Image
        src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
        alt="Loading with placeholder"
        placeholderSrc="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=50&q=10"
        className="h-48 w-full rounded-lg"
      />
      <Image
        src="invalid-url.jpg"
        alt="Failed load"
        className="h-48 w-full rounded-lg"
        fallback={<span className="text-red-500">Failed to load image</span>}
      />
    </div>
  );
}
