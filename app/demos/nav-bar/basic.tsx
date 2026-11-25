"use client";

import { NavBar, buttonVariants, cn } from "@/ui/skins";

const docs = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "styling", label: "Styling" },
  { id: "components", label: "Components" },
  { id: "skills", label: "Skills" },
  { id: "changelog", label: "Changelog" },
];

export default function NavBarBasicDemo() {
  return (
    <div className="mx-auto w-full max-w-[28rem]">
      <NavBar
        items={docs}
        getKey={(doc) => doc.id}
        renderItem={(doc) => (
          <a href={`#${doc.id}`} className={cn(buttonVariants.text, "px-3")}>
            {doc.label}
          </a>
        )}
      />
    </div>
  );
}
