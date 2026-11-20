"use client";
import { Breadcrumb } from "@/ui/skins";

export default function BreadcrumbDataDemo() {
  return (
    <div className="flex flex-col items-center">
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
