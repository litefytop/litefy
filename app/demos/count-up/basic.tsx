"use client";

import { CountUp } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="flex h-112 flex-col items-center justify-center gap-6">
      <CountUp to={12480} duration={2.2} className="text-3xl leading-9 font-strong" />
      <CountUp to={99.9} decimals={1} suffix="%" duration={1.8} className="text-3xl leading-9 font-strong" />
      <CountUp to={42000} prefix="$" duration={2.4} className="text-3xl leading-9 font-strong" />
    </div>
  );
}
