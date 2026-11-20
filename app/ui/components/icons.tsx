import * as React from "react";

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

export const ArrowDown = createIcon("ArrowDown", [["path",{"d":"M12 5v14","key":"s699le"}],["path",{"d":"m19 12-7 7-7-7","key":"1idqje"}]]);
export const ArrowLeft = createIcon("ArrowLeft", [["path",{"d":"m12 19-7-7 7-7","key":"1l729n"}],["path",{"d":"M19 12H5","key":"x3x0zl"}]]);
export const ArrowRight = createIcon("ArrowRight", [["path",{"d":"M5 12h14","key":"1ays0h"}],["path",{"d":"m12 5 7 7-7 7","key":"xquz4c"}]]);
export const ArrowUp = createIcon("ArrowUp", [["path",{"d":"m5 12 7-7 7 7","key":"hav0vg"}],["path",{"d":"M12 19V5","key":"x0mq9r"}]]);
export const ArrowUpDown = createIcon("ArrowUpDown", [["path",{"d":"m21 16-4 4-4-4","key":"f6ql7i"}],["path",{"d":"M17 20V4","key":"1ejh1v"}],["path",{"d":"m3 8 4-4 4 4","key":"11wl7u"}],["path",{"d":"M7 4v16","key":"1glfcx"}]]);
export const Calendar = createIcon("Calendar", [["path",{"d":"M8 2v3","key":"1ioesn"}],["path",{"d":"M16 2v3","key":"otl347"}],["rect",{"x":"3","y":"3","width":"18","height":"18","rx":"2","key":"h1oib"}],["path",{"d":"M3 9h18","key":"1pudct"}]]);
export const Check = createIcon("Check", [["path",{"d":"M20 6 9 17l-5-5","key":"1gmf2c"}]]);
export const Copy = createIcon("Copy", [["rect",{"width":"14","height":"14","x":"8","y":"8","rx":"2","ry":"2","key":"1jniyj"}],["path",{"d":"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2","key":"1jvk9l"}]]);
export const ChevronDown = createIcon("ChevronDown", [["path",{"d":"m6 9 6 6 6-6","key":"qrunsl"}]]);
export const ChevronLeft = createIcon("ChevronLeft", [["path",{"d":"m15 18-6-6 6-6","key":"1wnfg3"}]]);
export const ChevronRight = createIcon("ChevronRight", [["path",{"d":"m9 18 6-6-6-6","key":"mthhwq"}]]);
export const ChevronUp = createIcon("ChevronUp", [["path",{"d":"m18 15-6-6-6 6","key":"153udz"}]]);
export const Filter = createIcon("Filter", [["polygon",{"points":"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3","key":"1dn5cm"}]]);
export const ChevronsLeft = createIcon("ChevronsLeft", [["path",{"d":"m11 17-5-5 5-5","key":"13zhaf"}],["path",{"d":"m18 17-5-5 5-5","key":"h8a8et"}]]);
export const ChevronsRight = createIcon("ChevronsRight", [["path",{"d":"m6 17 5-5-5-5","key":"xnjwq"}],["path",{"d":"m13 17 5-5-5-5","key":"17xmmf"}]]);
export const CircleAlert = createIcon("CircleAlert", [["circle",{"cx":"12","cy":"12","r":"10","key":"1mglay"}],["line",{"x1":"12","x2":"12","y1":"8","y2":"12","key":"17uq2b"}],["line",{"x1":"12","x2":"12.01","y1":"16","y2":"16","key":"p32p05"}]]);
export const CircleCheck = createIcon("CircleCheck", [["circle",{"cx":"12","cy":"12","r":"10","key":"1mglay"}],["path",{"d":"m16 9-5.5 5.5L8 12","key":"xofnsj"}]]);
export const CircleInfo = createIcon("CircleInfo", [["circle",{"cx":"12","cy":"12","r":"10","key":"1mglay"}],["path",{"d":"M12 16v-4","key":"1j6kan"}],["path",{"d":"M12 8h.01","key":"e9boi3"}]]);
export const CircleHelp = createIcon("CircleHelp", [["circle",{"cx":"12","cy":"12","r":"10","key":"1mglay"}],["path",{"d":"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3","key":"1u773s"}],["path",{"d":"M12 17h.01","key":"p32p05"}]]);
export const Eye = createIcon("Eye", [["path",{"d":"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0","key":"1nclc0"}],["circle",{"cx":"12","cy":"12","r":"3","key":"1v7zrd"}]]);
export const EyeOff = createIcon("EyeOff", [["path",{"d":"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49","key":"ct8e1f"}],["path",{"d":"M14.084 14.158a3 3 0 0 1-4.242-4.242","key":"151rxh"}],["path",{"d":"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143","key":"13bj9a"}],["path",{"d":"m2 2 20 20","key":"1ooewy"}]]);
export const ImagePlus = createIcon("ImagePlus", [["path",{"d":"M16 5h6","key":"1vod17"}],["path",{"d":"M19 2v6","key":"4bpg5p"}],["path",{"d":"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5","key":"1ue2ih"}],["path",{"d":"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21","key":"1xmnt7"}],["circle",{"cx":"9","cy":"9","r":"2","key":"af1f0g"}]]);
export const Keyboard = createIcon("Keyboard", [["rect",{"width":"20","height":"16","x":"2","y":"4","rx":"2","key":"18nysk"}],["path",{"d":"M10 8h.01","key":"1rm3in"}],["path",{"d":"M12 12h.01","key":"1iwdgo"}],["path",{"d":"M14 8h.01","key":"1l4xgt"}],["path",{"d":"M16 12h.01","key":"1kctni"}],["path",{"d":"M18 8h.01","key":"1gzsmf"}],["path",{"d":"M6 12h.01","key":"1jddij"}],["path",{"d":"M9 16h6","key":"104jjy"}]]);
export const Loader2 = createIcon("Loader2", [["path",{"d":"M21 12a9 9 0 1 1-6.219-8.56","key":"13zald"}]]);
export const Minus = createIcon("Minus", [["path",{"d":"M5 12h14","key":"1ays0h"}]]);
export const Mic = createIcon("Mic", [["path",{"d":"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z","key":"1slu7t"}],["path",{"d":"M19 10v2a7 7 0 0 1-14 0v-2","key":"1jhay1"}],["line",{"x1":"12","x2":"12","y1":"19","y2":"22","key":"1jhtsm"}]]);
export const Paperclip = createIcon("Paperclip", [["path",{"d":"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48","key":"1ur7nd"}]]);
export const RotateCcw = createIcon("RotateCcw", [["path",{"d":"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8","key":"1tq86m"}],["path",{"d":"M3 3v5h5","key":"1rr3ia"}]]);
export const Square = createFilledIcon("Square", "M6.5 6h11a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5Z");
export const ThumbsUp = createIcon("ThumbsUp", [["path",{"d":"M7 10v12","key":"1iyvxc"}],["path",{"d":"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z","key":"z6pgb3"}]]);
export const ThumbsDown = createIcon("ThumbsDown", [["path",{"d":"M17 14V2","key":"11a9lz"}],["path",{"d":"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z","key":"1o2i7j"}]]);
export const MoreHorizontal = createIcon("MoreHorizontal", [["circle",{"cx":"12","cy":"12","r":"1","key":"41hilf"}],["circle",{"cx":"19","cy":"12","r":"1","key":"1wjl8i"}],["circle",{"cx":"5","cy":"12","r":"1","key":"1pcz8c"}]]);
export const Plus = createIcon("Plus", [["path",{"d":"M5 12h14","key":"1ays0h"}],["path",{"d":"M12 5v14","key":"s699le"}]]);
export const Search = createIcon("Search", [["path",{"d":"m21 21-4.34-4.34","key":"14j7rj"}],["circle",{"cx":"11","cy":"11","r":"8","key":"4ej97u"}]]);
export const Send = createIcon("Send", [["path",{"d":"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z","key":"1ffxy3"}],["path",{"d":"m21.854 2.147-10.94 10.939","key":"12cjpa"}]]);
export const Sparkle = createFilledIcon("Sparkle", "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z");
export const TriangleAlert = createIcon("TriangleAlert", [["path",{"d":"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3","key":"wmoenq"}],["path",{"d":"M12 9v4","key":"juzpu7"}],["path",{"d":"M12 17h.01","key":"p32p05"}]]);
export const X = createIcon("X", [["path",{"d":"M18 6 6 18","key":"1bl5f8"}],["path",{"d":"m6 6 12 12","key":"d8bk6v"}]]);

export type IconName =
  | "arrowDown" | "arrowLeft" | "arrowRight" | "arrowUp" | "arrowUpDown"
  | "calendar" | "check" | "chevronDown" | "chevronLeft" | "chevronRight" | "chevronUp"
  | "chevronsLeft" | "chevronsRight" | "circleAlert" | "circleCheck" | "circleHelp" | "circleInfo" | "eye" | "eyeOff"
  | "imagePlus" | "keyboard" | "loader" | "minus" | "moreHorizontal" | "plus"
  | "search" | "send" | "sparkle" | "square" | "triangleAlert" | "close"
  | "copy" | "mic" | "paperclip" | "rotateCcw" | "thumbsDown" | "thumbsUp";
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
} satisfies Record<IconName, typeof ArrowDown>;

export const sourceNames: Record<IconName, string> = {
  arrowDown: "ArrowDown",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  arrowUp: "ArrowUp",
  arrowUpDown: "ArrowUpDown",
  calendar: "Calendar",
  check: "Check",
  chevronDown: "ChevronDown",
  chevronLeft: "ChevronLeft",
  chevronRight: "ChevronRight",
  chevronUp: "ChevronUp",
  chevronsLeft: "ChevronsLeft",
  chevronsRight: "ChevronsRight",
  circleAlert: "CircleAlert",
  circleCheck: "CircleCheck",
  circleInfo: "CircleInfo",
  circleHelp: "CircleHelp",
  eye: "Eye",
  eyeOff: "EyeOff",
  imagePlus: "ImagePlus",
  keyboard: "Keyboard",
  loader: "Loader2",
  minus: "Minus",
  moreHorizontal: "MoreHorizontal",
  plus: "Plus",
  search: "Search",
  send: "Send",
  sparkle: "Sparkle",
  square: "Square",
  triangleAlert: "TriangleAlert",
  close: "X",
  copy: "Copy",
  mic: "Mic",
  paperclip: "Paperclip",
  rotateCcw: "RotateCcw",
  thumbsDown: "ThumbsDown",
  thumbsUp: "ThumbsUp",
};

