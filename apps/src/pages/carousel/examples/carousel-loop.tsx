import { useState } from "react";
import { Carousel, Pagination } from "@/component";

export default function CarouselLoop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 5;

  return (
    <div className="w-full">
      <Carousel activeIndex={activeIndex} onChange={setActiveIndex} loop>
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
      <Pagination
        current={activeIndex + 1}
        pageSize={1}
        total={totalSlides}
        onPageChange={(page) => setActiveIndex(page - 1)}
        className="justify-center"
      >
        <Pagination.Indicator variant="bar" />
      </Pagination>
    </div>
  );
}
