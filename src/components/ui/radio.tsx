import { RadioPrimitive } from "@/components";
import { cn, ClassNameValue } from "@/lib";
import { CircleIcon } from "./icons";
import { RadioPrimitiveProps } from "@/components";
import {
  RadioItemPrimitive,
  RadioItemPrimitiveProps,
} from "@/components";

const radioItemclass = `flex items-center h-9 px-2 gap-2 focus-visible:[&_svg]:fill-ring aria-invalid:[&_svg]:stroke-destructive/20 data-[state=on]:[&_svg]:fill-primary data-[state=on]:[&_svg]:stroke-primary-foreground disabled:opacity-50 disabled:text-muted-foreground disabled:[&_svg]:fill-muted disabled:[&_svg]:stroke-muted`;

export type RadioItemProps = {
  className?: ClassNameValue;
} & RadioItemPrimitiveProps;

function RadioItem({ className, ...props }: RadioItemProps) {
  return (
    <RadioItemPrimitive
      {...props}
      className={cn(RadioItem.class, className)}
    >
      <CircleIcon />
      {props.children}
    </RadioItemPrimitive>
  );
}

RadioItem.class = radioItemclass;



const radioclass = {
  base: "w-full flex gap-2 ",

  direction: {
    horizontal: "flex-wrap",
    vertical: "flex-col items-center ",
  },
};

export type RadioProps<T extends string> = Omit<
  RadioPrimitiveProps,
  "onValueChange" | "defaultValue" | "value" | "size"
> & {
  defaultValue?: T;
  value?: T;
  onValueChange?: (
    value: T,
  ) => (void | Promise<void>) | import("react").Dispatch<import("react").SetStateAction<T>>;
  rounded?: boolean;
  direction?: keyof typeof radioclass.direction;
  className?: ClassNameValue;
  area?: string;
};

function Radio<T extends string>({
  className,
  onValueChange,
  direction = "horizontal",
  area,
  ...props
}: RadioProps<T>) {
  return (
    <RadioPrimitive
      {...props}
      className={cn(
        Radio.class.base,
        Radio.class.direction[direction],
        className,
      )}
      onValueChange={onValueChange as (value: string) => void | Promise<void>}
      style={{ gridArea: area }}
    >
        {props.children}
    </RadioPrimitive>
  );
}

Radio.class = radioclass;

Radio.Item = RadioItem;

export { Radio };
