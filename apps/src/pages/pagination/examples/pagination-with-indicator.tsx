import { useState } from "react";
import { Pagination } from "@/component";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function PaginationWithIndicator() {
  const [current, setCurrent] = useState(1);

  return (
    <Pagination
      current={current}
      pageSize={10}
      total={100}
      onPageChange={setCurrent}
    >
      <Pagination.Description />

      <div className="flex items-center gap-2">
    
          <Pagination.Controls variant="first">
            <ChevronsLeft className="size-4" />
          </Pagination.Controls>
          <Pagination.Controls variant="prev">
            <ChevronLeft className="size-4" />
          </Pagination.Controls>
          <Pagination.Indicator variant="number" />
          <Pagination.Controls variant="next">
            <ChevronRight className="size-4" />
          </Pagination.Controls>
          <Pagination.Controls variant="last">
            <ChevronsRight className="size-4" />
          </Pagination.Controls>
       
      </div>
    </Pagination>
  );
}
