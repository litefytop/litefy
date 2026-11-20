"use client";

import { Details } from "@/ui/skins";

const itemClasses = "w-full rounded-none border-0 not-last:border-b-hair not-last:border-border";

export default function Demo() {
  return (
    <div className="flex w-full flex-col items-center overflow-hidden rounded-md border-frame border-border shadow-surface">
      {/* Elements sharing the same name form an exclusive group: opening one
          closes the others, handled entirely by the browser (Chrome 126+,
          Safari 17.2+, Firefox 130+; older browsers keep independent panels). */}
      <Details name="faq" label="What does the name prop do?" className={itemClasses}>
        Giving several details elements the same name puts them in one exclusive group. No
        JavaScript is involved — the browser closes the siblings for you.
      </Details>
      <Details name="faq" label="Does it need controlled state?" className={itemClasses}>
        No. The open state lives in the DOM; subscribe through the native onToggle event when you
        need to react to changes.
      </Details>
      <Details name="faq" label="Can it live next to Collapse and Accordion?" className={itemClasses}>
        Yes. Details is a lightweight alternative, not a replacement — pick Collapse or Accordion
        for animated, fully controlled panels, and Details for plain zero-JS disclosure.
      </Details>
    </div>
  );
}
