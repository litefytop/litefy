import { ReactNode } from "react";

import { cn, ClassNameValue } from "@/lib";

import { CheckIcon } from "./icons";
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

const checkboxClass = {
  toggle:
    "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border-y border-r first:border-l",
  checkbox: "data-[state=checked]:text-foreground/80",
};

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
  const setValue = (value: string, checked: boolean) => {
    if (checked) {
      setCheckedMap((map) => {
        map.set(value, true);
        return map;
      });
    } else {
      setCheckedMap((map) => {
        map.delete(value);
        return map;
      });
    }

    onValueChange?.(Array.from(checkedMap.keys()) as T[]);
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
    const nextElement = groupRef.current?.querySelector(
      `[value="${nextValue}"]`,
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
        inert={props.inert || disabled}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex inert:pointer-events-none inert:opacity-50",
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
    className?: ClassNameValue;
    props?: ComponentProps<"span">;
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
  variant = "checkbox",
  className,
  indicator,
  ...props
}: CheckboxProps) => {
  const resolvedIndicator = {
    checked: <CheckIcon />,
    unchecked: null,
    hidden: false,
    ...indicator,
  };
  const id = useId();
  const { checkedMap, setValue, register, unregister } = useCheckboxContext();

  const [isChecked, setIsChecked] = useState(() => checkedMap.has(value));

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
    setIsChecked(newChecked);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

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
      disabled={disable}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 min-w-8 px-2 cursor-pointer",
        checkboxClass[variant],
        className,
      )}
    >
      {!resolvedIndicator.hidden && (
        <span
          {...resolvedIndicator.props}
          className={cn(
            " data-[state=checked]:bg-primary data-[state=checked]:border-primary-foreground data-[state=checked]:text-primary-foreground flex items-center justify-center size-4 rounded-md border border-foreground",
            resolvedIndicator.className,
          )}
          data-state={isChecked ? "checked" : "unchecked"}
        >
          {isChecked ? resolvedIndicator.checked : resolvedIndicator.unchecked}
        </span>
      )}
      {props.children}
    </button>
  );
};

Checkbox.Group = CheckboxGroup;
