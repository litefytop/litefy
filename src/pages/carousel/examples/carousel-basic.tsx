import { useState } from "react";
import { Carousel, Button } from "@/component";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselBasic() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full space-y-4">
      <Carousel
        activeIndex={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        className="w-full"
      >
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

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm">
          {activeIndex + 1} / 3
        </span>
        <Button
          variant="ghost"
          onClick={() => setActiveIndex((i) => Math.min(2, i + 1))}
          disabled={activeIndex === 2}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
