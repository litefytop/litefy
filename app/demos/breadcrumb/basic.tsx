"use client";
import { Breadcrumb } from "@/ui";

export default function BreadcrumbDataDemo() {
  return (
    <div className="p-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "#" },
          { label: "Project", href: "#" },
          { label: "Current Page" },
        ]}
      />
    </div>
  );
}
