import { type ClassNameValue, cn } from "../utils/cn";
import { InputGroup, InputLeading, InputRoot, InputTrailing } from "./input-group";



export type InputProps = Omit<React.ComponentProps<"input">, "type" | "className"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  className?: ClassNameValue;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
  classNames?: {
    leading?: ClassNameValue;
    trailing?: ClassNameValue;
    root?: ClassNameValue;
  };
  styles?: {
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    root?: React.CSSProperties;
  };
};

export function Input({ classNames, styles, leading, trailing, invalid, className, style, ...props }: InputProps) {
  return (
    <InputGroup
      className={cn(className)}
      style={style}
      invalid={invalid}
    >
      {leading && (
        <InputLeading className={classNames?.leading} style={styles?.leading}>
          {leading}
        </InputLeading>
      )}
      <InputRoot
        {...props}
        aria-invalid={invalid}
        className={classNames?.root}
        style={styles?.root}
      />
      {trailing && (
        <InputTrailing className={classNames?.trailing} style={styles?.trailing}>
          {trailing}
        </InputTrailing>
      )}
    </InputGroup>
  );
}
