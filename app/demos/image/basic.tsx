"use client";

import {  Image } from "@/ui";

export default function ImageLoadingDemo() {


  return (
        <Image
        src="https://picsum.photos/seed/1/1200/800"
        alt="Random landscape image"
        className="w-160 h-80 border"
      />
  );
}
