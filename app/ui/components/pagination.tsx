"use client";
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, } from "./icons";
import { Button, ButtonRoot } from "./button";
import { resolveSlotClassName, type SlotClassName } from "../utils/cn";
export interface PaginationRootProps extends Omit<React.ComponentProps<"nav">, "className"> {
    className?: string;
}
export function PaginationRoot(props: PaginationRootProps) {
    return <nav aria-label="pagination" {...props}/>;
}
export interface PaginationFirstProps extends Omit<React.ComponentProps<typeof ButtonRoot>, "className"> {
    className?: SlotClassName;
}
export interface PaginationPrevProps extends Omit<React.ComponentProps<typeof ButtonRoot>, "className"> {
    className?: SlotClassName;
}
export interface PaginationNextProps extends Omit<React.ComponentProps<typeof ButtonRoot>, "className"> {
    className?: SlotClassName;
}
export interface PaginationLastProps extends Omit<React.ComponentProps<typeof ButtonRoot>, "className"> {
    className?: SlotClassName;
}
function PaginationNavButton({ label, children, className, ...props }: PaginationFirstProps & {
    label: string;
}) {
    return (<Button type="button" aria-label={label} {...props} className={resolveSlotClassName(className, { disabled: Boolean(props.disabled) })} icon={children}/>);
}
export function PaginationFirst(props: PaginationFirstProps) {
    return (<PaginationNavButton label="First page" {...props}>
      <ChevronsLeft />
    </PaginationNavButton>);
}
export function PaginationPrev(props: PaginationPrevProps) {
    return (<PaginationNavButton label="Previous page" {...props}>
      <ChevronLeft />
    </PaginationNavButton>);
}
export function PaginationNext(props: PaginationNextProps) {
    return (<PaginationNavButton label="Next page" {...props}>
      <ChevronRight />
    </PaginationNavButton>);
}
export function PaginationLast(props: PaginationLastProps) {
    return (<PaginationNavButton label="Last page" {...props}>
      <ChevronsRight />
    </PaginationNavButton>);
}
export interface PaginationEllipsisProps extends Omit<React.ComponentProps<"span">, "className" | "children"> {
    className?: string;
}
export function PaginationEllipsis(props: PaginationEllipsisProps) {
    return (<span {...props}>
      <MoreHorizontal aria-hidden/>
    </span>);
}
export interface PaginationSummaryProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
}
export function PaginationSummary(props: PaginationSummaryProps) {
    return (<span {...props}/>);
}
function PaginationPageInput({ page, totalPages, onPageChange, className, style }: {
    page: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    className?: string;
    style?: React.CSSProperties;
}) {
    const [draft, setDraft] = React.useState(String(page));
    const [prevPage, setPrevPage] = React.useState(page);
    if (prevPage !== page) {
        setPrevPage(page);
        setDraft(String(page));
    }
    const commit = () => {
        const next = Number(draft);
        if (Number.isInteger(next) && next >= 1 && next <= totalPages && next !== page) onPageChange?.(next);
        else setDraft(String(page));
    };
    return (<input type="text" inputMode="numeric" aria-label={`Go to page, 1 to ${totalPages}`} value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => {
            if (event.key === "Enter")
                commit();
        }} className={className} style={style}/>);
}
export interface PaginationPagesProps {
    page: number;
    totalPages: number;
    siblingCount?: number;
    onPageChange?: (page: number) => void;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        page?: string;
        ellipsis?: string;
    };
    styles?: {
        page?: React.CSSProperties;
        ellipsis?: React.CSSProperties;
    };
}
function range(start: number, end: number): number[] {
    const out: number[] = [];
    for (let page = Math.max(1, start); page <= end; page++)
        out.push(page);
    return out;
}
type PageItem = { key: string; page?: number };
function buildPageItems(page: number, totalPages: number, siblingCount: number): PageItem[] {
    const maxSlots = siblingCount * 2 + 5;
    if (totalPages <= maxSlots)
        return range(1, totalPages).map((p) => ({ key: String(p), page: p }));
    const left = Math.max(2, page - siblingCount);
    const right = Math.min(totalPages - 1, page + siblingCount);
    const items: PageItem[] = [{ key: "1", page: 1 }];
    if (left > 2)
        items.push({ key: "ellipsis-start" });
    for (let p = left; p <= right; p++)
        items.push({ key: String(p), page: p });
    if (right < totalPages - 1)
        items.push({ key: "ellipsis-end" });
    items.push({ key: String(totalPages), page: totalPages });
    return items;
}
export function PaginationPages({ page, totalPages, siblingCount = 1, onPageChange, className, style, classNames, styles, }: PaginationPagesProps) {
    const items = React.useMemo(() => buildPageItems(page, totalPages, siblingCount), [page, totalPages, siblingCount]);
    return (<div className={className} style={style}>
      {items.map(({ key, page: pageNumber }) => pageNumber === undefined ? (<PaginationEllipsis key={key} className={classNames?.ellipsis} style={styles?.ellipsis}/>) : (<ButtonRoot key={key} type="button" aria-current={pageNumber === page ? "page" : undefined} onClick={() => onPageChange?.(pageNumber)} className={classNames?.page} style={styles?.page}>
            {pageNumber}
          </ButtonRoot>))}
    </div>);
}
export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
    siblingCount?: number;
    summary?: React.ReactNode;
    className?: string;
    classNames?: {
        controls?: string;
        nav?: SlotClassName;
        boundary?: SlotClassName;
        pages?: string;
        page?: string;
        ellipsis?: string;
        summary?: string;
        pageInput?: string;
        pageTotal?: string;
    };
    styles?: {
        controls?: React.CSSProperties;
        nav?: React.CSSProperties;
        boundary?: React.CSSProperties;
        pages?: React.CSSProperties;
        page?: React.CSSProperties;
        ellipsis?: React.CSSProperties;
        summary?: React.CSSProperties;
        pageInput?: React.CSSProperties;
        pageTotal?: React.CSSProperties;
    };
}
export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, summary, className, classNames, styles, }: PaginationProps) {
    const atStart = page <= 1;
    const atEnd = page >= totalPages;
    const hasSummary = summary !== null && summary !== undefined;
    return (<PaginationRoot className={className}>
      {hasSummary && (<PaginationSummary className={classNames?.summary} style={styles?.summary}>
          {summary}
        </PaginationSummary>)}
      <div className={classNames?.controls} style={styles?.controls}>
        <PaginationFirst disabled={atStart} onClick={() => onPageChange?.(1)} className={classNames?.boundary} style={styles?.boundary}/>
        <PaginationPrev disabled={atStart} onClick={() => onPageChange?.(page - 1)} className={classNames?.nav} style={styles?.nav}/>
        <PaginationPages page={page} totalPages={totalPages} siblingCount={siblingCount} onPageChange={onPageChange} className={classNames?.pages} style={styles?.pages} classNames={{ page: classNames?.page, ellipsis: classNames?.ellipsis }} styles={{ page: styles?.page, ellipsis: styles?.ellipsis }}/>
        <PaginationPageInput page={page} totalPages={totalPages} onPageChange={onPageChange} className={classNames?.pageInput} style={styles?.pageInput}/>
        <span className={classNames?.pageTotal} style={styles?.pageTotal}>{`/ ${totalPages}`}</span>
        <PaginationNext disabled={atEnd} onClick={() => onPageChange?.(page + 1)} className={classNames?.nav} style={styles?.nav}/>
        <PaginationLast disabled={atEnd} onClick={() => onPageChange?.(totalPages)} className={classNames?.boundary} style={styles?.boundary}/>
      </div>
    </PaginationRoot>);
}
