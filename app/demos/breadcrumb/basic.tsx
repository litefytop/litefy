"use client";
import { Breadcrumb } from "@/ui";

export default function BreadcrumbDataDemo() {
  return (
    <div className="p-4">
      <Breadcrumb
        inert
        items={[
          { label: "Home", href: "/" },
          { label: "Project", href: "/project" },
          { label: "Current Page" },
        ]}
      />
    </div>
  );
}
