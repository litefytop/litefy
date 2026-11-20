"use client";

import { Image } from "@/ui/skins";

export default function ImageBasicDemo() {
  return (
    <Image
      className="h-64 w-full"
      src="https://picsum.photos/seed/3/1200/800"
      alt="Random image"
      loadingNode={
        <img
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/3/100/100"
          alt=""
        />
      }
    />
  );
}
