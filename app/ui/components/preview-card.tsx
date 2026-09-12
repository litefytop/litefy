"use client";

import * as React from "react";
import { Card } from "./card";
import { Image } from "./image";
import { Tooltip } from "./tooltip";
import { type ClassNameValue, cn } from "../utils/cn";

export interface PreviewCardProps {
  src: string;
  alt?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactNode;
  href?: string;
  delay?: number;
  className?: ClassNameValue;
  classNames?: {
    image?: ClassNameValue;
    body?: ClassNameValue;
    title?: ClassNameValue;
    description?: ClassNameValue;
  };
}

export function PreviewCard({
  src,
  alt,
  title,
  description,
  trigger,
  href = "#",
  delay = 200,
  className,
  classNames,
}: PreviewCardProps) {
  const card = (
    <Card className={cn(trigger ? "w-72" : "w-full max-w-sm", className)}>
      <Image src={src} alt={alt} className={cn("h-40 w-full", classNames?.image)} />
      <div className={cn("p-4", classNames?.body)}>
        <h3 className={cn("text-sm font-semibold", classNames?.title)}>{title}</h3>
        {description && (
          <p className={cn("mt-1 text-xs text-muted-foreground", classNames?.description)}>
            {description}
          </p>
        )}
      </div>
    </Card>
  );

  if (!trigger) return card;

  return (
    <Tooltip delay={delay} content={card}>
      <a href={href} className="text-primary underline-offset-4 hover:text-accent hover:underline">
        {trigger}
      </a>
    </Tooltip>
  );
}
