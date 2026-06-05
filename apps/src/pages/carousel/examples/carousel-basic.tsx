import { useState } from "react";
import { Carousel, Pagination } from "@/component";

export default function CarouselBasic() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <Carousel activeIndex={activeIndex} onChange={setActiveIndex}>
        <div className="h-48 flex items-center justify-center bg-primary/10 rounded-lg">
          <span className="text-2xl font-bold">Slide 1</span>
        </div>
        <div className="h-48 flex items-center justify-center bg-secondary/10 rounded-lg">
          <span className="text-2xl font-bold">Slide 2</span>
        </div>
        <div className="h-48 flex items-center justify-center bg-accent/10 rounded-lg">
          <span className="text-2xl font-bold">Slide 3</span>
        </div>
      </Carousel>
      <Pagination
        current={activeIndex + 1}
        pageSize={1}
        total={3}
        onPageChange={(page) => setActiveIndex(page - 1)}
        className="justify-center"
      >
        <Pagination.Indicator variant="dot" />
      </Pagination>
    </div>
  );
}
