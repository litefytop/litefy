"use client";
import { Breadcrumb } from "@/ui";

export default function BreadcrumbDataDemo() {
  return (
    <div className="p-4">
      <Breadcrumb items={[{ label: "Home" }, { label: "Project" }, { label: "Current Page" }]} />
    </div>
  );
}
