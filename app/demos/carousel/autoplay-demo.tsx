"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui/carousel";

export default function CarouselAutoplayDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Carousel
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        autoPlay
        autoPlayInterval={2000}
        loop
      >
        <div className="h-48 bg-linear-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Auto Play Slide 1
        </div>
        <div className="h-48 bg-linear-to-br from-yellow-500 to-yellow-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Auto Play Slide 2
        </div>
        <div className="h-48 bg-linear-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          Auto Play Slide 3
        </div>
      </Carousel>
      <div className="flex justify-center gap-1 mt-4">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === activeIndex ? "bg-blue-500 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
