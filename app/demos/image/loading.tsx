"use client";

import { Image } from "@/ui";

export default function ImageLoadingDemo() {
  return (
    <Image
      src="https://picsum.photos/seed/3/1200/800"
      alt="Random image"
      className={"w-160 h-80 border"}
      loadingNode={
        <div className="relative size-full bg-neutral animate-pulse">
          <img
            src="https://picsum.photos/seed/3/100/100"
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          />
        </div>
      }
    />
  );
}
