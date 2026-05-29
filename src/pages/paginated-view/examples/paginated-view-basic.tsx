import { useState, useRef } from "react";
import { PaginatedView, Paper, PaperProvider, Pagination, Button } from "@/component";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

function PaperContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-muted-foreground mt-2">{description}</p>
      <p 
        className="absolute bottom-4 right-4 text-sm text-muted-foreground print:hidden"
        data-page-number
      />
    </div>
  );
}

export default function PaginatedViewWithPaper() {
  const [current, setCurrent] = useState(1);
  const totalPages = 3;
  const paperRef = useRef<{ print: () => void }>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end print:hidden">
        <Button variant="ghost" onClick={() => paperRef.current?.print()}>
          <Printer className="size-4 mr-2" />
          Print All
        </Button>
      </div>

      <PaperProvider ref={paperRef} totalPages={totalPages}>
        <PaginatedView activeIndex={current - 1}>
          <Paper variant="a5" orientation="portrait" countable>
            <PaperContent title="Welcome" description="This is the first page" />
          </Paper>
          <Paper variant="a5" orientation="portrait" countable>
            <PaperContent title="Features" description="This is the second page" />
          </Paper>
          <Paper variant="a5" orientation="portrait" countable>
            <PaperContent title="Contact" description="This is the third page" />
          </Paper>
        </PaginatedView>
      </PaperProvider>

      <Pagination
        current={current}
        pageSize={1}
        total={totalPages}
        onPageChange={(page) => setCurrent(page)}
      >
        <Pagination.Description />
        <Pagination.Controls>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setCurrent((c) => Math.max(1, c - 1))}
              disabled={current === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium">
              {current} / {totalPages}
            </span>
            <Button
              variant="ghost"
              onClick={() => setCurrent((c) => Math.min(totalPages, c + 1))}
              disabled={current === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </Pagination.Controls>
      </Pagination>
    </div>
  );
}
