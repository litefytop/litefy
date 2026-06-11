import { cn, ClassNameValue } from "@/lib";

type TitleVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const titleClass = {
  h1: "scroll-m-20 text-3xl font-extrabold tracking-tight text-balance mb-4 ",
  h2: "scroll-m-20 text-2xl font-semibold tracking-tight mb-4",
  h3: "scroll-m-20 text-xl font-semibold tracking-tight mb-2",
  h4: "scroll-m-20 text-xl font-medium tracking-tight mb-2",
  h5: "scroll-m-20 text-lg font-medium tracking-tight mb-1",
  h6: "scroll-m-20 text-lg font-normal tracking-tight mb-1",
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
