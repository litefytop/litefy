import { useRef } from "react";
import { PaperProvider, Paper, Button } from "@/component";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export default function PaperPrint() {
  const contentRef = useRef<HTMLDivElement>(null);

  const printFn = useReactToPrint({
    contentRef,
    documentTitle: "Print Document",
  });

  return (
    <div className="space-y-4 h-screen">
      <div className="flex justify-end print:hidden">
        <Button variant="ghost" onClick={() => printFn()}>
          <Printer className="size-4 mr-2" />
          Print All
        </Button>
      </div>

      <PaperProvider totalPages={8}>
        <div ref={contentRef} className="space-y-8">
          {/* 5 content pages */}
          <Paper variant="a4" orientation="portrait" countable>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4">Welcome</h1>
              <p className="text-muted-foreground text-center max-w-md">
                This is the first page of our document. Welcome to the printing demo.
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          <Paper variant="a4" orientation="portrait" countable>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4">Features</h1>
              <p className="text-muted-foreground text-center max-w-md">
                Our paper component supports automatic page numbering and booklet printing.
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          <Paper variant="a4" orientation="portrait" countable>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4">Documentation</h1>
              <p className="text-muted-foreground text-center max-w-md">
                Complete documentation with examples and API reference.
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          <Paper variant="a4" orientation="portrait" countable>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4">Examples</h1>
              <p className="text-muted-foreground text-center max-w-md">
                Multiple examples showing different use cases and configurations.
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          <Paper variant="a4" orientation="portrait" countable>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4">Conclusion</h1>
              <p className="text-muted-foreground text-center max-w-md">
                This is the fifth page. The remaining pages will be auto-completed.
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          {/* 3 auto-completed pages to reach 8 total */}
          <Paper variant="a4" orientation="portrait" countable={false}>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4 text-gray-300">Blank Page</h1>
              <p className="text-muted-foreground text-center max-w-md">
                This is an auto-completed blank page (page 6).
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          <Paper variant="a4" orientation="portrait" countable={false}>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4 text-gray-300">Blank Page</h1>
              <p className="text-muted-foreground text-center max-w-md">
                This is an auto-completed blank page (page 7).
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>

          <Paper variant="a4" orientation="portrait" countable={false}>
            <div className="flex flex-col items-center justify-center h-full relative">
              <h1 className="text-3xl font-bold mb-4 text-gray-300">End</h1>
              <p className="text-muted-foreground text-center max-w-md">
                This is the final page (page 8). Ready for booklet printing.
              </p>
              <div 
                className="absolute bottom-4 right-4 text-sm text-muted-foreground print:block"
                data-page-number
              />
            </div>
          </Paper>
        </div>
      </PaperProvider>

      <div className="p-4 bg-muted rounded-lg print:hidden">
        <h3 className="font-semibold mb-2">Print Instructions:</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Total pages: 8 (5 content + 3 auto-completed)</li>
          <li>• Paper size: A4 portrait</li>
          <li>• Printer feature: Booklet printing (2 sheets of A3 = 8 pages)</li>
          <li>• Page numbers are displayed using CSS with data-page-number</li>
        </ul>
      </div>
    </div>
  );
}
