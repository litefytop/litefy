import * as React from "react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowDown,
  IconArrowsUpDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheck,
  IconCopy,
  IconDots,
  IconEye,
  IconEyeOff,
  IconHelp,
  IconInfoCircle,
  IconKeyboard,
  IconLoader2,
  IconMicrophone,
  IconMinus,
  IconPaperclip,
  IconPhotoPlus,
  IconPlus,
  IconRotate2,
  IconSearch,
  IconSend,
  IconSparkles,
  IconSquare,
  IconThumbDown,
  IconThumbUp,
  IconX,
} from "@tabler/icons-react";

/*
 * Icon adapter: @tabler/icons-react implementation of the canonical export
 * list. Install with `litefy add <component> -i tabler` — the file lands as
 * `icons.tsx`, so skeleton imports (`./icons`) stay untouched. Canonical names
 * that differ in tabler are renamed here; every other glyph maps 1:1.
 *
 * Tabler icons default to 24px (stroke 2) instead of the lucide adapter's
 * 16px — size skeleton slots through classNames as needed.
 */

export const ArrowDown = IconArrowDown;
export const ArrowLeft = IconArrowLeft;
export const ArrowRight = IconArrowRight;
export const ArrowUp = IconArrowUp;
export const ArrowUpDown = IconArrowsUpDown;
export const Calendar = IconCalendar;
export const Check = IconCheck;
export const ChevronDown = IconChevronDown;
export const ChevronLeft = IconChevronLeft;
export const ChevronRight = IconChevronRight;
export const ChevronUp = IconChevronUp;
export const ChevronsLeft = IconChevronsLeft;
export const ChevronsRight = IconChevronsRight;
export const CircleAlert = IconAlertCircle;
export const CircleCheck = IconCircleCheck;
export const CircleHelp = IconHelp;
export const CircleInfo = IconInfoCircle;
export const Copy = IconCopy;
export const Eye = IconEye;
export const EyeOff = IconEyeOff;
export const ImagePlus = IconPhotoPlus;
export const Keyboard = IconKeyboard;
export const Loader2 = IconLoader2;
export const Mic = IconMicrophone;
export const Minus = IconMinus;
export const MoreHorizontal = IconDots;
export const Paperclip = IconPaperclip;
export const Plus = IconPlus;
export const RotateCcw = IconRotate2;
export const Search = IconSearch;
export const Send = IconSend;
export const Sparkle = IconSparkles;
export const Square = IconSquare;
export const ThumbsDown = IconThumbDown;
export const ThumbsUp = IconThumbUp;
export const TriangleAlert = IconAlertTriangle;
export const X = IconX;

export type IconProps = React.ComponentProps<"svg">;

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
  | "imagePlus"
  | "keyboard"
  | "loader"
  | "mic"
  | "minus"
  | "moreHorizontal"
  | "paperclip"
  | "plus"
  | "rotateCcw"
  | "search"
  | "send"
  | "sparkle"
  | "square"
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
  imagePlus: ImagePlus,
  keyboard: Keyboard,
  loader: Loader2,
  minus: Minus,
  moreHorizontal: MoreHorizontal,
  plus: Plus,
  search: Search,
  send: Send,
  sparkle: Sparkle,
  square: Square,
  triangleAlert: TriangleAlert,
  close: X,
  copy: Copy,
  mic: Mic,
  paperclip: Paperclip,
  rotateCcw: RotateCcw,
  thumbsDown: ThumbsDown,
  thumbsUp: ThumbsUp,
} as const;

export const sourceNames: Record<keyof typeof icons, string> = {
  arrowDown: "ArrowDown",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  arrowUp: "ArrowUp",
  arrowUpDown: "ArrowsUpDown",
  calendar: "Calendar",
  check: "Check",
  chevronDown: "ChevronDown",
  chevronLeft: "ChevronLeft",
  chevronRight: "ChevronRight",
  chevronUp: "ChevronUp",
  chevronsLeft: "ChevronsLeft",
  chevronsRight: "ChevronsRight",
  circleAlert: "AlertCircle",
  circleCheck: "CircleCheck",
  circleInfo: "InfoCircle",
  circleHelp: "Help",
  eye: "Eye",
  eyeOff: "EyeOff",
  imagePlus: "PhotoPlus",
  keyboard: "Keyboard",
  loader: "Loader2",
  minus: "Minus",
  moreHorizontal: "Dots",
  plus: "Plus",
  search: "Search",
  send: "Send",
  sparkle: "Sparkles",
  square: "Square",
  triangleAlert: "AlertTriangle",
  close: "X",
  copy: "Copy",
  mic: "Microphone",
  paperclip: "Paperclip",
  rotateCcw: "Rotate2",
  thumbsDown: "ThumbDown",
  thumbsUp: "ThumbUp",
};
