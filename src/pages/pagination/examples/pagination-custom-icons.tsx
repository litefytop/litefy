import { useState } from "react";
import { Pagination, usePagination } from "@/component";
import { 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight,
  SkipBack,
  StepBack,
  StepForward,
  SkipForward
} from "lucide-react";

const buttonStyles = 
  "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none size-8 rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50";

function PaginationButtons({ iconSet = "default" }: { iconSet?: "default" | "custom" }) {
  const { current, totalPages, goFirst, goPrev, goNext, goLast } = usePagination();

  const icons = iconSet === "custom" 
    ? {
        first: <SkipBack className="size-4" />,
        previous: <StepBack className="size-4" />,
        next: <StepForward className="size-4" />,
        last: <SkipForward className="size-4" />,
      }
    : {
        first: <ChevronsLeft className="size-4" />,
        previous: <ChevronLeft className="size-4" />,
        next: <ChevronRight className="size-4" />,
        last: <ChevronsRight className="size-4" />,
      };

  return (
    <>
      <button
        onClick={goFirst}
        disabled={current === 1}
        className={buttonStyles}
      >
        {icons.first}
      </button>
      <button
        onClick={goPrev}
        disabled={current === 1}
        className={buttonStyles}
      >
        {icons.previous}
      </button>
      <button
        onClick={goNext}
        disabled={current === totalPages}
        className={buttonStyles}
      >
        {icons.next}
      </button>
      <button
        onClick={goLast}
        disabled={current === totalPages}
        className={buttonStyles}
      >
        {icons.last}
      </button>
    </>
  );
}

export default function PaginationCustomIcons() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="space-y-4">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={100}
        onPageChange={setCurrent}
        onPageSizeChange={setPageSize}
      >
        <Pagination.Description />
        <Pagination.Controls>
          <Pagination.Sizer />
          <PaginationButtons iconSet="custom" />
        </Pagination.Controls>
      </Pagination>

      <Pagination
        current={current}
        pageSize={pageSize}
        total={100}
   
        onPageChange={setCurrent}
        onPageSizeChange={setPageSize}
      >
        <Pagination.Description />
        <Pagination.Controls>
          <Pagination.Sizer />
          <PaginationButtons iconSet="default" />
        </Pagination.Controls>
      </Pagination>
    </div>
  );
}
