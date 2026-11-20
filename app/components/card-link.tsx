"use client";

import { Link, type LinkProps } from "react-router";
import { useSiteSkin } from "./site-skin";

export function CardLink({ className, children, ...props }: LinkProps) {
  const { cardClasses, cardButtonClasses, cn } = useSiteSkin();
  return (
    <Link {...props} className={cn(cardClasses, cardButtonClasses, className)}>
      {children}
    </Link>
  );
}
