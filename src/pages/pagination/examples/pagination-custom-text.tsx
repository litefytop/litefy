import { useState } from "react";
import { Pagination } from "@/component";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

const buttonStyles = 
  "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none size-8 rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50";

function PaginationButtons() {
  const { current, totalPages, goFirst, goPrev, goNext, goLast } = Pagination.use();

  return (
    <>
      <button
        onClick={goFirst}
        disabled={current === 1}
        className={buttonStyles}
      >
        <ChevronsLeft className="size-4" />
      </button>
      <button
        onClick={goPrev}
        disabled={current === 1}
        className={buttonStyles}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={goNext}
        disabled={current === totalPages}
        className={buttonStyles}
      >
        <ChevronRight className="size-4" />
      </button>
      <button
        onClick={goLast}
        disabled={current === totalPages}
        className={buttonStyles}
      >
        <ChevronsRight className="size-4" />
      </button>
    </>
  );
}

export default function PaginationCustomText() {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={85}
      onChange={(page, size) => {
        setCurrent(page);
        setPageSize(size);
      }}
    >
      <Pagination.Description
        format={(total, current, totalPages) =>
          `共 ${total} 条记录，当前第 ${current} / ${totalPages} 页`
        }
      />
      <Pagination.Controls>
        <Pagination.Sizer format={(size) => `${size} 条/页`} />
        <PaginationButtons />
      </Pagination.Controls>
    </Pagination>
  );
}
