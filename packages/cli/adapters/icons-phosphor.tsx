import * as React from "react";
import {
  ArrowCounterClockwise as IconArrowCounterClockwise,
  ArrowDown as IconArrowDown,
  ArrowLeft as IconArrowLeft,
  ArrowRight as IconArrowRight,
  ArrowUp as IconArrowUp,
  ArrowsDownUp as IconArrowsDownUp,
  Calendar as IconCalendar,
  CaretDoubleLeft as IconCaretDoubleLeft,
  CaretDoubleRight as IconCaretDoubleRight,
  CaretDown as IconCaretDown,
  CaretLeft as IconCaretLeft,
  CaretRight as IconCaretRight,
  CaretUp as IconCaretUp,
  Check as IconCheck,
  CheckCircle as IconCheckCircle,
  CircleNotch as IconCircleNotch,
  Copy as IconCopy,
  DotsSixVertical as IconDotsSixVertical,
  DotsThree as IconDotsThree,
  Eye as IconEye,
  EyeSlash as IconEyeSlash,
  Info as IconInfo,
  MagnifyingGlass as IconMagnifyingGlass,
  Minus as IconMinus,
  Plus as IconPlus,
  Question as IconQuestion,
  Sparkle as IconSparkle,
  ThumbsDown as IconThumbsDown,
  ThumbsUp as IconThumbsUp,
  Warning as IconWarning,
  WarningCircle as IconWarningCircle,
  X as IconX,
} from "@phosphor-icons/react";

/*
 * Icon adapter: @phosphor-icons/react implementation of the canonical export
 * list (contract defined in app/ui/components/icons.tsx). Install with
 * `litefy add <component> -i phosphor` — the file lands as `icons.tsx`, so
 * skeleton imports (`./icons`) stay untouched.
 *
 * Structure: the shared part below exports the full contract (factories,
 * types, `icons`, `sourceNames`); the glyph section is this library's
 * adapter table — each of the 32 contract glyphs is aliased to its phosphor
 * export. Glyphs a library does not have would fall back to inline lucide
 * definitions copied from the default face; phosphor covers all 32.
 *
 * Phosphor icons default to 1em (context size, regular weight) instead of
 * the lucide adapter's 16px — size skeleton slots through classNames as
 * needed.
 */

// ——— shared contract: factories & types (identical to the default face) ———

export type IconNode = [tag: string, attrs: Record<string, string | number>];

export type IconProps = React.ComponentProps<"svg">;

export function createIcon(displayName: string, iconNode: IconNode[]) {
  function Icon({
    className,
    children,
    ...rest
  }: IconProps) {
    const a11y = "aria-label" in rest || "aria-labelledby" in rest;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={!children && !a11y ? "true" : undefined}
        className={className}
        {...rest}
      >
        {iconNode.map(([tag, attrs], i) => {
          const { key, ...svgAttrs } = attrs;
          return React.createElement(tag, { key: (key as string) ?? i, ...svgAttrs });
        })}
        {children}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

export function createFilledIcon(displayName: string, d: string) {
  function Icon({ className, children, ...rest }: IconProps) {
    const a11y = "aria-label" in rest || "aria-labelledby" in rest;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="currentColor"
        stroke="none"
        aria-hidden={!children && !a11y ? "true" : undefined}
        className={className}
        {...rest}
      >
        <path d={d} />
        {children}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

// ——— adapter table: 32 glyphs, source = @phosphor-icons/react ———

export const ArrowDown = IconArrowDown;
export const ArrowLeft = IconArrowLeft;
export const ArrowRight = IconArrowRight;
export const ArrowUp = IconArrowUp;
export const ArrowUpDown = IconArrowsDownUp;
export const Calendar = IconCalendar;
export const Check = IconCheck;
export const ChevronDown = IconCaretDown;
export const ChevronLeft = IconCaretLeft;
export const ChevronRight = IconCaretRight;
export const ChevronUp = IconCaretUp;
export const ChevronsLeft = IconCaretDoubleLeft;
export const ChevronsRight = IconCaretDoubleRight;
export const CircleAlert = IconWarningCircle;
export const CircleCheck = IconCheckCircle;
export const CircleHelp = IconQuestion;
export const CircleInfo = IconInfo;
export const Copy = IconCopy;
export const Eye = IconEye;
export const EyeOff = IconEyeSlash;
export const GripVertical = IconDotsSixVertical;
export const Loader2 = IconCircleNotch;
export const Minus = IconMinus;
export const MoreHorizontal = IconDotsThree;
export const Plus = IconPlus;
export const RotateCcw = IconArrowCounterClockwise;
export const Search = IconMagnifyingGlass;
export const Sparkle = IconSparkle;
export const ThumbsDown = IconThumbsDown;
export const ThumbsUp = IconThumbsUp;
export const TriangleAlert = IconWarning;
export const X = IconX;

export type IconName =
  | "arrowDown"
  | "arrowLeft"
  | "arrowRight"
  | "arrowUp"
  | "arrowUpDown"
  | "calendar"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "chevronUp"
  | "chevronsLeft"
  | "chevronsRight"
  | "circleAlert"
  | "circleCheck"
  | "circleHelp"
  | "circleInfo"
  | "close"
  | "copy"
  | "eye"
  | "eyeOff"
  | "gripVertical"
  | "loader"
  | "minus"
  | "moreHorizontal"
  | "plus"
  | "rotateCcw"
  | "search"
  | "sparkle"
  | "thumbsDown"
  | "thumbsUp"
  | "triangleAlert";

export const icons = {
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowUpDown: ArrowUpDown,
  calendar: Calendar,
  check: Check,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronsLeft: ChevronsLeft,
  chevronsRight: ChevronsRight,
  circleAlert: CircleAlert,
  circleCheck: CircleCheck,
  circleInfo: CircleInfo,
  circleHelp: CircleHelp,
  eye: Eye,
  eyeOff: EyeOff,
  gripVertical: GripVertical,
  loader: Loader2,
  minus: Minus,
  moreHorizontal: MoreHorizontal,
  plus: Plus,
  search: Search,
  sparkle: Sparkle,
  triangleAlert: TriangleAlert,
  close: X,
  copy: Copy,
  rotateCcw: RotateCcw,
  thumbsDown: ThumbsDown,
  thumbsUp: ThumbsUp,
} as const;

export const sourceNames: Record<keyof typeof icons, string> = {
  arrowDown: "ArrowDown",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  arrowUp: "ArrowUp",
  arrowUpDown: "ArrowsDownUp",
  calendar: "Calendar",
  check: "Check",
  chevronDown: "CaretDown",
  chevronLeft: "CaretLeft",
  chevronRight: "CaretRight",
  chevronUp: "CaretUp",
  chevronsLeft: "CaretDoubleLeft",
  chevronsRight: "CaretDoubleRight",
  circleAlert: "WarningCircle",
  circleCheck: "CheckCircle",
  circleInfo: "Info",
  circleHelp: "Question",
  eye: "Eye",
  eyeOff: "EyeSlash",
  gripVertical: "DotsSixVertical",
  loader: "CircleNotch",
  minus: "Minus",
  moreHorizontal: "DotsThree",
  plus: "Plus",
  search: "MagnifyingGlass",
  sparkle: "Sparkle",
  triangleAlert: "Warning",
  close: "X",
  copy: "Copy",
  rotateCcw: "ArrowCounterClockwise",
  thumbsDown: "ThumbsDown",
  thumbsUp: "ThumbsUp",
};
