"use client";

import { useState } from "react";
import { Button } from "@/ui/skins";
import { Check, Copy, Loader2 } from "@/components/icons";
import { useSpin } from "@/ui/utils";

export default function Demo() {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedIcon, setCopiedIcon] = useState(false);
  const spinRef = useSpin<SVGSVGElement>(saving);

  const flash = (setter: (value: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        data-variant="outline"
        status={{ icon: <Loader2 ref={spinRef} />, active: saving }}
        disabled={saving}
        aria-busy={saving || undefined}
        onClick={() => flash(setSaving)}
      >
        Save
      </Button>
      <Button
        data-variant="outline"
        icon={<Copy />}
        status={{ icon: <Check />, active: copied }}
        onClick={() => flash(setCopied)}
      >
        Copy
      </Button>
      <Button
        data-variant="outline"
        icon={<Copy />}
        aria-label="Copy"
        status={{ icon: <Check />, active: copiedIcon }}
        onClick={() => flash(setCopiedIcon)}
      />
    </div>
  );
}
