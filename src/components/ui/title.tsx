import { cn, ClassNameValue } from "@/lib";

type TitleVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "legend" | "dt" | "caption" | "figcaption";

const titleClass = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight",
  h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-medium tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  h5: "scroll-m-20 text-lg font-semibold tracking-tight",
  h6: "scroll-m-20 text-base font-semibold tracking-tight",
  legend: "mb-3 font-medium text-base",
  dt: "mb-3 font-medium text-base",
  caption: "mb-3 font-medium text-base",
  figcaption: "mb-3 font-medium text-base",
};

export type TitleProps = {
  as?: TitleVariant;
  className?: ClassNameValue;
} & React.HTMLAttributes<HTMLHeadingElement>;

export function Title({ as: Component = "h4", className, ...props }: TitleProps) {
  return (
    <Component {...props} className={cn(titleClass[Component], className)}>
      {props.children}
    </Component>
  );
}
