"use client";
import { Button } from "@/ui";
import { dialog } from "@/ui";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => {
          dialog.success({
            title: <span className="flex gap-2"><CircleCheck className="fill-success text-background"/>Success</span>,
            children: "Operation completed successfully.",
          });
        }}
      >
        Open Success Dialog
      </Button>
      <Button
        onClick={() => {
          dialog.warning({
            title: <span className="flex gap-2"><TriangleAlert className="fill-warning text-background"/>Warning</span>,
            children: "Please check your input before submitting.",
          });
        }}
      >
        Open Warning Dialog
      </Button>
      <Button
        onClick={() => {
          dialog.error({
            title: <span className="flex gap-2"><CircleAlert className="fill-danger text-background"/>Error</span>,
            children: "Something went wrong, please try again later.",
          });
        }}
      >
        Open Error Dialog
      </Button>
      <Button
        onClick={() => {
          dialog.info({
            title: <span className="flex gap-2"><Info className="fill-info text-background"/>Info</span>,
            children: "This is an informational message.",
          });
        }}
      >
        Open Info Dialog
      </Button>
    </div>
  );
}
