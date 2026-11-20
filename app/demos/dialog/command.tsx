"use client";
import { Button } from "@/ui/skins";
import { dialog } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <Button
        data-variant="outline"
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
        data-variant="outline"
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
        data-variant="outline"
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
        data-variant="outline"
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
