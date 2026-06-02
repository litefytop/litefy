import { useState } from "react";
import { Carousel } from "@/component";

const images = [
  "https://picsum.photos/seed/1/800/400",
  "https://picsum.photos/seed/2/800/400",
  "https://picsum.photos/seed/3/800/400",
];

export default function CarouselAutoPlay() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full space-y-4">
      <Carousel
        activeIndex={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        autoPlay
        autoPlayInterval={2000}
      >
        {images.map((src, i) => (
          <div key={i} className="h-48 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      <div className="flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              activeIndex === i ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
