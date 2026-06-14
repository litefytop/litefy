"use client";

import { Image } from "@/components/ui";

export default function ImageBasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Image
        src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
        alt="Beautiful landscape"
        className="h-48 w-full rounded-lg"
      />
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
        alt="Mountain view"
        className="h-48 w-full rounded-lg"
      />
    </div>
  );
}
