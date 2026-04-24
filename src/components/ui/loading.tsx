"use client";

import { cn, ClassNameValue } from "@/lib";
import { ReactNode, useState, useEffect } from "react";
import { Spin } from "@/components";


export type LoadingProps = {
  loading?: boolean;
  children: ReactNode;
  className?: ClassNameValue;
  delay?: number;
  icon?: ReactNode;
};

function Loading({
  loading = false,
  children,
  className,
  delay = 300,
  icon,
}: LoadingProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(loading), delay);
    return () => clearTimeout(timer);
  }, [loading, delay]);

  return (
    <div className={cn("relative", className)}>
      {children}
      {show && (icon || <Spin className={"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8"} />)}
    </div>
  );
}


export { Loading };
