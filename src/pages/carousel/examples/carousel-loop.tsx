import { useState } from "react";
import { Carousel, Button } from "@/component";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselLoop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 5;

  return (
    <div className="w-full space-y-4">
      <Carousel
        activeIndex={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        loop
      >
        {Array.from({ length: totalSlides }, (_, i) => (
          <div
            key={i}
            className="h-48 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: `hsl(${(i * 60) % 360}, 50%, 90%)` }}
          >
            <span className="text-2xl font-bold">Slide {i + 1}</span>
          </div>
        ))}
      </Carousel>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setActiveIndex((i) => (i - 1 + totalSlides) % totalSlides)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm">
          {activeIndex + 1} / {totalSlides}
        </span>
        <Button
          variant="ghost"
          onClick={() => setActiveIndex((i) => (i + 1) % totalSlides)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
