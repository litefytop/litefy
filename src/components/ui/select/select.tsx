import { cn, ClassNameValue } from "@/lib";
import { CaretDownIcon } from "@/components/ui/icons";

import { Option } from "./option";
import { OptionGroup } from "./group";
import type { OptionProps } from "./option";
import type { OptionGroupProps } from "./group";
import { useRef } from "react";

const selectclass = `appearance-none bg-background  w-full
  h-8 px-2 py-1 text-sm  rounded-md  shadow-xs  border-input border hover:outline
  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 
  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] 
  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`;

export type SelectProps = Omit<React.ComponentProps<"select">, "className"> & {
  data?: OptionProps[] | OptionGroupProps[];
  placeholder?: string;
  className?: ClassNameValue;
  area?: string;
};

function Select({
  data,
  placeholder,
  className,
  children,
  area,
  ...props
}: SelectProps) {
  const options = data?.map((item, index) => {
    if ("items" in item) {
      return <OptionGroup key={index} {...item} />;
    }
    return <Option key={index} {...item} />;
  });
  const ref = useRef<HTMLSelectElement>(null);
  return (
    <span className="relative h-8" style={{ gridArea: area }}>
      <select ref={ref} className={cn(Select.class, className)} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children || options}
      </select>
      <CaretDownIcon className="absolute pointer-events-none top-1/2 -translate-y-1/2 right-3" />
    </span>
  );
}

Select.class = selectclass;

Select.Option = Option;

Select.OptionGroup = OptionGroup;
export { Select };

export type { OptionProps, OptionGroupProps };
