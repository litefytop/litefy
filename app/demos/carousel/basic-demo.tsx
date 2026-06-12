"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function CarouselBasicDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Carousel activeIndex={activeIndex} onChange={setActiveIndex}>
        <div className="h-48 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Slide 1
        </div>
        <div className="h-48 bg-linear-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Slide 2
        </div>
        <div className="h-48 bg-linear-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Slide 3
        </div>
      </Carousel>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          className="inline-flex items-center justify-center cursor-pointer aspect-square bg-transparent"
        >
          <ChevronLeft />
        </button>
        <span className="self-center">
          {activeIndex + 1} / 3
        </span>
        <button
          onClick={() => setActiveIndex((i) => Math.min(2, i + 1))}
          className="inline-flex items-center justify-center cursor-pointer aspect-square bg-transparent"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
