import { useState } from "react";
import { Carousel, Pagination } from "@/component";

const images = [
  "https://picsum.photos/seed/1/800/400",
  "https://picsum.photos/seed/2/800/400",
  "https://picsum.photos/seed/3/800/400",
];

export default function CarouselAutoPlay() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <Carousel
        activeIndex={activeIndex}
        onChange={setActiveIndex}
        autoPlay
        autoPlayInterval={2000}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="h-48 flex items-center justify-center rounded-lg overflow-hidden"
          >
            <img
              src={src}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Carousel>
      <Pagination
        current={activeIndex + 1}
        pageSize={1}
        total={images.length}
        onPageChange={(page) => setActiveIndex(page - 1)}
        className="justify-center"
      >
        <Pagination.Indicator variant="dot" />
      </Pagination>
    </div>
  );
}
