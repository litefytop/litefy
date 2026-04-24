import { ReactNode } from "react";

import { cn, ClassNameValue } from "@/lib";

import { CheckIcon, SquareIcon } from "./icons";
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

const checkboxGroupClass = {
  base: "w-full flex gap-2 inert:pointer-events-none inert:opacity-50",
  direction: {
    horizontal: "flex-wrap",
    vertical: "flex-col",
  },
};

const checkboxClass =
  "inline-flex items-center justify-center gap-2 shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 cursor-pointer data-[state=checked]:text-primary-foreground";

export type CheckboxContextProps = {
  checkedMap: Map<string, boolean>;
  setValue: (value: string, checked: boolean) => void;
  register: (value: string) => void;
  unregister: (value: string) => void;
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
  disable?: boolean;
  name?: string;
  invalid?: boolean;
  defaultValue?: T[];
  value?: T[];
  onValueChange?: (
    value: T[],
  ) => (void | Promise<void>) | Dispatch<SetStateAction<T>>;
  direction?: "horizontal" | "vertical";
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
  direction = "horizontal",
  ...props
}: CheckboxGroupProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<string[]>([]);
  const indexMapRef = useRef<Map<string, number>>(new Map());
  const [checkedMap, setCheckedMap] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    if (controlledValues) {
      controlledValues.forEach((v) => map.set(v, true));
    } else {
      defaultValue.forEach((v) => map.set(v, true));
    }
    return map;
  });
  const [focusValue, setFocusValue] = useState("");
  const setValue = (value: string, checked: boolean) => {
    setFocusValue(value);

    setCheckedMap((map) => {
      if (checked) {
        map.set(value, true);
      } else {
        map.delete(value);
      }
      return map;
    });

    const arrayValue = Array.from(checkedMap.keys());
    onValueChange?.(arrayValue as T[]);
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
    checkedMap,
    setValue,
    register,
    unregister,
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!groupRef.current?.contains(document.activeElement)) return;
    const allValues = itemsRef.current;
    if (allValues.length === 0) return;

    const currentIndex = focusValue
      ? (indexMapRef.current.get(focusValue) ?? -1)
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
      case " ":
        if (focusValue) {
          e.preventDefault();
          const isChecked = checkedMap.has(focusValue);
          setValue(focusValue, !isChecked);
        }
        return;
      default:
        return;
    }

    e.preventDefault();
    const nextValue = allValues[targetIndex];
    const nextElement = groupRef.current?.querySelector(
      `[data-checkbox-value="${nextValue}"]`,
    ) as HTMLElement;
    nextElement?.focus();
  };

  return (
    <CheckboxContext.Provider value={contextValue}>
      <div
        {...props}
        role="group"
        aria-invalid={invalid}
        ref={groupRef}
        onKeyDown={handleKeyDown}
        className={cn(
          checkboxGroupClass.base,
          checkboxGroupClass.direction[direction],
          className,
        )}
      >
        <input
          type="hidden"
          tabIndex={-1}
          readOnly
          value={Array.from(checkedMap.keys()).join(",")}
        />
        {children}
      </div>
    </CheckboxContext.Provider>
  );
}

export type CheckboxProps = Omit<
  ComponentProps<"button">,
  "value" | "onChange"
> & {
  onCheckedChange?: (checked: boolean) => void;
  value: string;
  disabled?: boolean;
  indicator?: {
    enable: boolean;
    checked: ReactNode;
    unchecked: ReactNode;
  };
  toggle?: boolean;
  className?: ClassNameValue;
  children?: ReactNode;
};

export const Checkbox = ({
  value,
  onCheckedChange,
  id: propsId,
  disabled: controlledDisable,
  className,
  indicator = {
    checked: <CheckIcon />,
    unchecked: <SquareIcon />,
    enable: true,
  },
  ...props
}: CheckboxProps) => {
  const id = useId();
  const { checkedMap, setValue, register, unregister } = useCheckboxContext();

  const [isChecked, setIsChecked] = useState(() => checkedMap.has(value));

  useEffect(() => {
    setIsChecked(checkedMap.has(value));
  }, [checkedMap, value]);

  useEffect(() => {
    register(value);
    return () => unregister(value);
  }, [value, register, unregister]);

  const disable = controlledDisable;

  const handleClick = () => {
    if (disable) return;
    const newChecked = !isChecked;
    setValue(value, newChecked);
    onCheckedChange?.(newChecked);
    console.log(isChecked);

  };

  return (
    <button
      {...props}
      id={propsId ?? id}
      data-checkbox-value={value}
      data-state={isChecked ? "on" : "off"}
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      tabIndex={0}
      disabled={disable}
      onClick={handleClick}
      className={cn(checkboxClass, className)}
    >
      {isChecked && indicator.checked}
      {isChecked == false && indicator.unchecked}
      {props.children}
    </button>
  );
};

Checkbox.Group = CheckboxGroup;
