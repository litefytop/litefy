"use client";
import { Button } from "@/ui";
import { dialog } from "@/ui";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => {
          dialog.success({
            title: "Success",
            children: "Operation completed successfully.",
          });
        }}
      >
        Open Success Dialog
      </Button>
      <Button
        onClick={() => {
          dialog.warning({
            title: "Warning",
            children: "Please check your input before submitting.",
          });
        }}
      >
        Open Warning Dialog
      </Button>
      <Button
        onClick={() => {
          dialog.error({
            title: "Error",
            children: "Something went wrong, please try again later.",
          });
        }}
      >
        Open Error Dialog
      </Button>
      <Button
        onClick={() => {
          dialog.info({
            title: "Info",
            children: "This is an informational message.",
          });
        }}
      >
        Open Info Dialog
      </Button>
    </div>
  );
}
