import { useState } from "react";
import { Pagination } from "@/component";
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
        <div className="flex items-center gap-2">
          <Pagination.Sizer />
          <div className="flex gap-2">
            <Pagination.Controls variant="first">
              <SkipBack className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="prev">
              <StepBack className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="next">
              <StepForward className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="last">
              <SkipForward className="size-4" />
            </Pagination.Controls>
          </div>
        </div>
      </Pagination>

      <Pagination
        current={current}
        pageSize={pageSize}
        total={100}
        onPageChange={setCurrent}
        onPageSizeChange={setPageSize}
      >
        <Pagination.Description />
        <div className="flex items-center gap-2">
          <Pagination.Sizer />
          <div className="flex gap-2">
            <Pagination.Controls variant="first">
              <ChevronsLeft className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="prev">
              <ChevronLeft className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="next">
              <ChevronRight className="size-4" />
            </Pagination.Controls>
            <Pagination.Controls variant="last">
              <ChevronsRight className="size-4" />
            </Pagination.Controls>
          </div>
        </div>
      </Pagination>
    </div>
  );
}
