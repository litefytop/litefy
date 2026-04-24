import { useRadioContext } from "./context";
import { ComponentProps, useId } from "react";

export type RadioItemPrimitiveProps = Omit<
  ComponentProps<"button">,
  "value"
> & {
  value: string;
};

export const RadioItemPrimitive = ({
  value,
  children,
  id: propsid,
  disabled: controlledDisable,
  ...props
}: RadioItemPrimitiveProps) => {
  const {
    checkedValue,
    toggle,
    uncontrolledDisable,
    invalid,
  } = useRadioContext();

  const id = useId();

  const checked = checkedValue === value;


  const disable = uncontrolledDisable || controlledDisable;

  return (
    <button
      {...props}
      id={propsid ?? id}
      data-radio-value={value}
      data-state={checked ? "on" : "off"}
      type="button"
      role="radio"
      aria-checked={checked}
      aria-invalid={checked && invalid}
      tabIndex={checked ? 0 : -1}
      disabled={disable}
      onClick={() => {
        if (!disable) {
          toggle(value);
        }
      }}
    >
      {children}
    </button>
  );
};
