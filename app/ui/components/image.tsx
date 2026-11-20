"use client";
import * as React from "react";
import { useImageStatus } from "../utils/use-image-status";
export interface ImageRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function ImageRoot(props: ImageRootProps) {
    return <div {...props}/>;
}
export interface ImageImageProps extends Omit<React.ComponentProps<"img">, "className"> {
    className?: string;
    src: string;
}
export function ImageImage(props: ImageImageProps) {
    return (<img {...props} loading="lazy" decoding="async"/>);
}
export interface ImageClassNames {
    root?: string;
    image?: string;
}
export interface ImageProps extends Omit<ImageImageProps, "className" | "style"> {
    className?: string;
    style?: React.CSSProperties;
    fallback?: React.ReactNode;
    loadingNode?: React.ReactNode;

    classNames?: ImageClassNames;
    styles?: {
        image?: React.CSSProperties;
    };
}
export function Image({ src, alt, className, style, fallback, loadingNode, classNames, styles, ...props }: ImageProps) {
    const status = useImageStatus(src);
    const [revealed, setRevealed] = React.useState(false);
    const revealedRef = React.useRef(false);
    React.useEffect(() => {
        if (status !== "success") {
            if (revealedRef.current) {
                revealedRef.current = false;
                setRevealed(false);
            }
            return;
        }
        const raf = requestAnimationFrame(() => {
            revealedRef.current = true;
            setRevealed(true);
        });
        return () => cancelAnimationFrame(raf);
    }, [status]);
    return (<ImageRoot className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} style={style}>
      {status === "failure" && fallback}
      {status !== "failure" && loadingNode}
      {status === "success" && (<ImageImage {...props} src={src} alt={alt} data-revealed={revealed || undefined} className={classNames?.image} style={styles?.image}/>)}
    </ImageRoot>);
}
