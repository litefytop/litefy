import { ReactNode, useCallback, useMemo } from "react";
import { cn, ClassNameValue } from "@/lib";
import { CheckIcon } from "./icons";
import {
  createContext,
  useContext,
  ComponentProps,
  useRef,
  useState,
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
};

const CheckboxContext = createContext<CheckboxContextProps | undefined>(undefined);

const useCheckboxContext = () => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error("useCheckboxContext must be used within a CheckboxGroup component");
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

  const [internalCheckedMap, setInternalCheckedMap] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    defaultValue.forEach((v) => map.set(v, true));
    return map;
  });

  const currentCheckedMap = useMemo(() => {
    if (isControlled) {
      const map = new Map<string, boolean>();
      controlledValues.forEach((v) => map.set(v, true));
      return map;
    }
    return internalCheckedMap;
  }, [isControlled, controlledValues, internalCheckedMap]);

  const setValue = useCallback(
    (value: string, checked: boolean) => {
      const newMap = new Map(currentCheckedMap);
      newMap.set(value, checked);

      const newValues = Array.from(newMap.entries())
        .filter(([, v]) => v)
        .map(([k]) => k) as T[];

      if (!isControlled) {
        setInternalCheckedMap(newMap);
      }

      onValueChange?.(newValues);
    },
    [currentCheckedMap, isControlled, onValueChange]
  );

  const contextValue = useMemo(() => ({
    checkedMap: currentCheckedMap,
    setValue,
  }), [currentCheckedMap, setValue]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const allowedKeys = ["ArrowRight","ArrowDown","ArrowLeft","ArrowUp","Home","End"];
    if (!allowedKeys.includes(e.key)) return;
    if (!groupRef.current?.contains(document.activeElement)) return;

    const buttons = Array.from(
      groupRef.current.querySelectorAll<HTMLButtonElement>('button[role="checkbox"]:not(:disabled)')
    );
    if (buttons.length === 0) return;

    const currentIndex = buttons.findIndex(btn => btn === document.activeElement);
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
        ref={groupRef}
        inert={disabled}
        onKeyDown={handleKeyDown}
        className={cn("flex", disabled && "pointer-events-none opacity-50", className)}
      >
        {name && Array.from(currentCheckedMap.keys()).map(val => (
          <input key={val} type="hidden" name={name} value={val} />
        ))}
        {children}
      </div>
    </CheckboxContext.Provider>
  );
}

export type CheckboxVariant = keyof typeof checkboxClass;

export type CheckboxProps = Omit<ComponentProps<"button">, "value" | "onChange"> & {
  onCheckedChange?: (checked: boolean) => void;
  value: string;
  disabled?: boolean;
  variant?: CheckboxVariant;
  indicator?: {
    checked?: ReactNode;
    unchecked?: ReactNode;
    hidden?: boolean;
    props?: Omit<ComponentProps<"span">, "className"> & { className?: ClassNameValue };
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
  const resolvedIndicator = { checked: <CheckIcon />, unchecked: null, hidden: false, ...indicator };
  const id = useId();
  const { checkedMap, setValue } = useCheckboxContext();
  const isChecked = checkedMap.get(value) === true;
  const disable = controlledDisable;

  const handleClick = useCallback(() => {
    if (disable) return;
    setValue(value, !isChecked);
    onCheckedChange?.(!isChecked);
  }, [disable, value, isChecked, setValue, onCheckedChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

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
        "inline-flex items-center justify-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 min-w-8 px-2 cursor-pointer",
        checkboxClass[variant],
        className
      )}
    >
      {!resolvedIndicator.hidden && (
        <span
          {...resolvedIndicator.props}
          data-state={isChecked ? "checked" : "unchecked"}
          className={cn(
            "flex items-center justify-center size-4 rounded-md border border-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary-foreground data-[state=checked]:text-primary-foreground",
            resolvedIndicator.props?.className
          )}
        >
          {isChecked ? resolvedIndicator.checked : resolvedIndicator.unchecked}
        </span>
      )}
      {props.children}
    </button>
  );
};

Checkbox.Group = CheckboxGroup;
