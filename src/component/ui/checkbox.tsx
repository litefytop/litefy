import {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
  useId,
} from "react";
import { cn, ClassNameValue } from "@/lib";
import { CheckIcon } from "./icons";
import { createContext, useContext, ComponentProps } from "react";

const checkboxClass = {
  toggle:
    "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-secondary text-secondary-foreground border-y border-r first:border-l group-data-[invalid=true]:data-[state=checked]:bg-destructive",
  checkbox: "data-[state=checked]:text-foreground/80 group-data-[invalid=true]:data-[state=checked]:text-destructive",
};

export type CheckboxContextProps = {
  value: string[];
  setValue: (value: string, checked: boolean) => void;
};

const CheckboxContext = createContext<CheckboxContextProps | undefined>(
  undefined,
);

const useCheckboxContext = () => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error(
      "useCheckboxContext must be used within a CheckboxGroup component",
    );
  }
  return context;
};

export type CheckboxGroupProps<T extends string> = {
  name?: string;
  invalid?: boolean;
  defaultValue?: T[];
  value?: T[];
  onValueChange?: (value: T[]) => void | Promise<void>;
  disabled?: boolean;
  className?: ClassNameValue;
  children?: ReactNode;
} & ComponentProps<"div">;

function CheckboxGroup<T extends string>({
  defaultValue = [],
  value: controlledValues,
  children,
  onValueChange,
  invalid,
  className,
  disabled,
  name,
  ...props
}: CheckboxGroupProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValues !== undefined;

  const [internalValues, setInternalValues] = useState<T[]>(defaultValue);

  const selectedValues = controlledValues ?? internalValues;

  const setValue = useCallback(
    (value: string, checked: boolean) => {
      let newValues: T[];

      if (checked) {
        newValues = [...selectedValues, value as T];
      } else {
        newValues = selectedValues.filter((v) => v !== value);
      }

      if (!isControlled) {
        setInternalValues(newValues);
      }

      onValueChange?.(newValues);
    },
    [selectedValues, isControlled, onValueChange],
  );

  const contextValue = useMemo(
    () => ({
      value: selectedValues,
      setValue,
    }),
    [selectedValues, setValue],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const allowedKeys = [
      "ArrowRight",
      "ArrowDown",
      "ArrowLeft",
      "ArrowUp",
      "Home",
      "End",
    ];
    if (!allowedKeys.includes(e.key)) return;
    if (!groupRef.current?.contains(document.activeElement)) return;

    const buttons = Array.from(
      groupRef.current.querySelectorAll<HTMLButtonElement>(
        'button[role="checkbox"]:not(:disabled)',
      ),
    );
    if (!buttons.length) return;

    const currentIndex = buttons.findIndex(
      (btn) => btn === document.activeElement,
    );
    if (currentIndex === -1) return;

    let targetIndex: number;
    const len = buttons.length;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        targetIndex = (currentIndex + 1) % len;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        targetIndex = (currentIndex - 1 + len) % len;
        break;
      case "Home":
        targetIndex = 0;
        break;
      case "End":
        targetIndex = len - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    buttons[targetIndex]?.focus();
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div
        {...props}
        role="group"
        aria-invalid={invalid}
        data-invalid={invalid}
        ref={groupRef}
        inert={disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex inert:pointer-events-none inert:opacity-50 group",
          className,
        )}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedValues}
            disabled={disabled}
          />
        )}
        {children}
      </div>
    </CheckboxContext.Provider>
  );
}

export type CheckboxVariant = keyof typeof checkboxClass;

export type CheckboxProps = Omit<
  ComponentProps<"button">,
  "value" | "onChange"
> & {
  onCheckedChange?: (checked: boolean) => void;
  value: string;
  disabled?: boolean;
  variant?: CheckboxVariant;
  indicator?: {
    checked?: ReactNode;
    unchecked?: ReactNode;
    hidden?: boolean;
    props?: Omit<ComponentProps<"span">, "className"> & {
      className?: ClassNameValue;
    };
  };
  className?: ClassNameValue;
  children?: ReactNode;
};

export const Checkbox = ({
  value,
  onCheckedChange,
  id: propsId,
  disabled: controlledDisable,
  variant = "checkbox",
  className,
  indicator,
  ...props
}: CheckboxProps) => {
  const { value: selectedValues, setValue } = useCheckboxContext();
  const id = useId();
  const disabled = controlledDisable;

  const isChecked = selectedValues.includes(value);

  const handleClick = useCallback(() => {
    if (disabled) return;
    setValue(value, !isChecked);
    onCheckedChange?.(!isChecked);
  }, [disabled, value, isChecked, setValue, onCheckedChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <button
      {...props}
      id={propsId ?? id}
      value={value}
      data-state={isChecked ? "checked" : "unchecked"}
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 min-w-8 px-3 py-1 cursor-pointer group-data-[invalid=true]:text-destructive",
        checkboxClass[variant],
        className,
      )}
    >
      {!indicator?.hidden && (
        <span
          {...indicator?.props}
          data-state={isChecked ? "checked" : "unchecked"}
          data-invalid={disabled}
          className={cn(
            "flex items-center justify-center size-4 rounded-md border border-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary-foreground data-[state=checked]:text-primary-foreground group-data-[invalid=true]:border-destructive group-data-[invalid=true]:data-[state=checked]:bg-destructive",
            indicator?.props?.className,
          )}
        >
          {isChecked
            ? (indicator?.checked ?? <CheckIcon />)
            : indicator?.unchecked}
        </span>
      )}
      {props.children}
    </button>
  );
};

Checkbox.Group = CheckboxGroup;
