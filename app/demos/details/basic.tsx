"use client";

import { Details } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex w-full flex-col items-center">
      <Details label="What is a details element?">
        A native disclosure widget rendered by the browser. Expanding, collapsing and the toggle
        event all come from the HTML element itself — no JavaScript state is involved.
      </Details>
    </div>
  );
}
