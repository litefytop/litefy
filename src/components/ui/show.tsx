"use client";

import { ReactNode, useEffect, useState } from "react";
import { ClassNameValue, cn } from "@/lib";
import { Empty,Skeleton } from "@/components";


const showClass = "w-full h-full";

export interface ShowProps {
  children?: ReactNode;
  loading?: boolean;
  failure?: boolean;
  loadingFallback?: ReactNode;
  failureFallback?: ReactNode;
  fallback?: ReactNode;
  className?: ClassNameValue;
}

export function Show({
  children,
  loading = false,
  failure = false,
  loadingFallback,
  failureFallback,
  fallback,
  className,
}: ShowProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading || (!show && loading)) {
    return (
      <div className={cn(showClass, className)}>
        {loadingFallback || <Skeleton />}
      </div>
    );
  }

  if (failure) {
    return (
      <div className={cn(showClass, className)}>
        {failureFallback || (
          <Empty>
            <p>加载失败</p>
          </Empty>
        )}
      </div>
    );
  }

  if (children) {
    if (Array.isArray(children) && children.length === 0) {
      return (
        <div className={cn(showClass, className)}>
          {fallback || <Empty><p>暂无数据</p></Empty>}
        </div>
      );
    }
    return <div className={cn(showClass, className)}>{children}</div>;
  }

  return (
    <div className={cn(showClass, className)}>
      {fallback || <Empty><p>暂无数据</p></Empty>}
    </div>
  );
}

