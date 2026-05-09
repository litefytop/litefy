import { ReactNode } from "react";

import { cn, ClassNameValue } from "@/lib";

import { CircleIcon, CircleCheckIcon } from "./icons";
import { Dispatch, SetStateAction } from "react";
import {
  createContext,
  useContext,
  ComponentProps,
  useRef,
  useState,
  useEffect,
  useId,
} from "react";

const radioDirectionClass = {
  horizontal: "flex-wrap",
  vertical: "flex-col",
};

const radioClass = {
  base: "inline-flex items-center justify-center gap-2 shrink-0  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer",
  variant: {
    primary:
      "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
    secondary:
      "data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
    outlined: "data-[state=on]:outline data-[state=on]:outline-primary",
    text: "data-[state=on]:text-primary",
  },
};

export type RadioContextProps = {
  value: string | undefined;
  setValue: (value: string) => void;
  register: (value: string) => void;
  unregister: (value: string) => void;
};

const RadioContext = createContext<RadioContextProps | undefined>(undefined);

const useRadioContext = () => {
  const context = useContext(RadioContext);

  if (!context) {
    throw new Error("useRadioContext must be used within a RadioGroup component");
  }

  return context;
};

export type RadioGroupProps<T extends string> = {
  disable?: boolean;
  name?: string;
  invalid?: boolean;
  defaultValue?: T;
  value?: T;
  onValueChange?: (
    value: T,
  ) => (void | Promise<void>) | Dispatch<SetStateAction<T>>;
  direction?: "horizontal" | "vertical";
  disabled?: boolean;
  className?: ClassNameValue;
  children?: ReactNode;
} & ComponentProps<"div">;

function RadioGroup<T extends string>({
  defaultValue,
  value: controlledValue,
  children,
  onValueChange,
  invalid,
  className,
  disabled,
  direction = "horizontal",
  ...props
}: RadioGroupProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<string[]>([]);
  const indexMapRef = useRef<Map<string, number>>(new Map());
  const [value, setValueState] = useState<string | undefined>(() => {
    if (controlledValue !== undefined) {
      return controlledValue;
    }
    return defaultValue;
  });

  const setValue = (newValue: string) => {
    setValueState(newValue);
    onValueChange?.(newValue as T);
  };

  const register = (value: string) => {
    itemsRef.current.push(value);
    indexMapRef.current.set(value, itemsRef.current.length - 1);
  };

  const unregister = (value: string) => {
    const index = indexMapRef.current.get(value);
    if (index !== undefined) {
      itemsRef.current.splice(index, 1);
      indexMapRef.current.clear();
      itemsRef.current.forEach((v, i) => indexMapRef.current.set(v, i));
    }
  };

  const contextValue = {
    value,
    setValue,
    register,
    unregister,
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!groupRef.current?.contains(document.activeElement)) return;
    const allValues = itemsRef.current;
    if (allValues.length === 0) return;

    const currentFocusValue = (document.activeElement as HTMLButtonElement)
      ?.value;
    const currentIndex = currentFocusValue
      ? (indexMapRef.current.get(currentFocusValue) ?? -1)
      : -1;
    let targetIndex: number;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        targetIndex = (currentIndex + 1) % allValues.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        targetIndex = (currentIndex - 1 + allValues.length) % allValues.length;
        break;
      case "Home":
        targetIndex = 0;
        break;
      case "End":
        targetIndex = allValues.length - 1;
        break;

      default:
        return;
    }

    e.preventDefault();
    const nextValue = allValues[targetIndex];
    setValue(nextValue);
  };

  return (
    <RadioContext.Provider value={contextValue}>
      <div
        {...props}
        role="group"
        aria-invalid={invalid}
        ref={groupRef}
        inert={props.inert || disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full flex inert:pointer-events-none inert:opacity-50",
          radioDirectionClass[direction],
          className,
        )}
      >
        <input
          type="hidden"
          tabIndex={-1}
          readOnly
          value={value ?? ""}
        />
        {children}
      </div>
    </RadioContext.Provider>
  );
}

export type RadioVariant = keyof typeof radioClass.variant;

export type RadioProps = Omit<
  ComponentProps<"button">,
  "value" | "onChange"
> & {
  onValueChange?: (value: string) => void;
  value: string;
  disabled?: boolean;
  variant?: RadioVariant;
  indicator?: {
    checked?: ReactNode;
    unchecked?: ReactNode;
    hidden?: boolean;
    className?: ClassNameValue;
    props?: ComponentProps<"span">;
  };
  className?: ClassNameValue;
  children?: ReactNode;
};

export const Radio = ({
  value,
  onValueChange,
  id: propsId,
  disabled: controlledDisable,
  variant = "text",
  className,
  indicator,
  ...props
}: RadioProps) => {
  const resolvedIndicator = {
    checked: <CircleCheckIcon />,
    unchecked: <CircleIcon />,
    hidden: false,
    ...indicator,
  };
  const id = useId();
  const { value: contextValue, setValue, register, unregister } = useRadioContext();

  const isChecked = contextValue === value;

  useEffect(() => {
    register(value);
    return () => unregister(value);
  }, [value, register, unregister]);

  const disable = controlledDisable;

  const handleClick = () => {
    if (disable) return;
    setValue(value);
    onValueChange?.(value);
  };

  return (
    <button
      {...props}
      id={propsId ?? id}
      value={value}
      data-state={isChecked ? "on" : "off"}
      type="button"
      role="radio"
      aria-checked={isChecked}
      tabIndex={isChecked ? 0 : -1}
      disabled={disable}
      onClick={handleClick}
      className={cn(
        radioClass.base,
        radioClass.variant[variant],
        className,
      )}
    >
      {!resolvedIndicator.hidden && (
        <span
          {...resolvedIndicator.props}
           className={cn("data-[state=checked]:[&_svg]:fill-inherit data-[state=checked]:fill-primary data-[state=checked]:text-primary-foreground", resolvedIndicator.className)}

          data-state={isChecked ? "on" : "off"}
        >
          {isChecked ? resolvedIndicator.checked : resolvedIndicator.unchecked}
        </span>
      )}
      {props.children}
    </button>
  );
};

Radio.Group = RadioGroup;
