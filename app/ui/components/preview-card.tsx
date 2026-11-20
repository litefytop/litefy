"use client";
import * as React from "react";
import { Image, type ImageClassNames } from "./image";
import { TooltipContent, useTooltipWiring } from "./tooltip";
export interface PreviewCardProps extends Omit<React.ComponentProps<"div">, "className" | "title"> {
    src: string;
    alt?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    trigger?: React.ReactNode;
    href?: string;
    delay?: number;
    className?: string;
    classNames?: {
        root?: string;
        trigger?: string;
        image?: ImageClassNames;
        body?: string;
        title?: string;
        description?: string;
    };
    styles?: {
        image?: React.CSSProperties;
        body?: React.CSSProperties;
        title?: React.CSSProperties;
        description?: React.CSSProperties;
    };
}
export function PreviewCard({ src, alt, title, description, trigger, href = "#", delay = 200, className, classNames, styles, ...props }: PreviewCardProps) {
    const uid = React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "");
    const popoverId = `preview-${uid}`;
    const anchorName = `--preview-${uid}`;
    const wiring = useTooltipWiring({ popoverId, anchorName, delay });
    const card = (<div {...props} data-floating={trigger ? "true" : undefined} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined}>
      <Image src={src} alt={alt} classNames={classNames?.image} styles={{ image: styles?.image }}/>
      <div className={classNames?.body} style={styles?.body}>
        <h3 className={classNames?.title} style={styles?.title}>
          {title}
        </h3>
        {description && (<p className={classNames?.description} style={styles?.description}>
            {description}
          </p>)}
      </div>
    </div>);
    if (!trigger)
        return card;
    return (<>
      <a className={classNames?.trigger} href={href} onPointerEnter={wiring.show} onPointerLeave={wiring.hide} onFocus={wiring.show} onBlur={wiring.hide} data-anchor-name={anchorName}>
        {trigger}
      </a>
      <TooltipContent id={popoverId} anchorName={anchorName} delay={delay}>
        {card}
      </TooltipContent>
    </>);
}
