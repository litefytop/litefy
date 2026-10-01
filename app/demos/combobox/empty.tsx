"use client";

import { SearchX } from "lucide-react";
import { Combobox } from "@/ui";

const frameworks = ["React", "Vue", "Svelte", "Solid", "Preact"];

export default function Demo() {
  return (
    <div className="w-72">
      <Combobox
        options={frameworks}
        placeholder="Search a framework"
        empty={
          <div className="flex flex-col items-center gap-1.5 py-4">
            <SearchX className="size-5" />
            <span>No framework matches your search</span>
          </div>
        }
      />
    </div>
  );
}
