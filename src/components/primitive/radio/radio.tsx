import {
  ComponentProps,
  KeyboardEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { RadioContext } from "./context";

export type RadioPrimitiveProps = {
  defaultValue?: string;
  disable?: boolean;
  name?: string;
  onValueChange?: (value: string) => void | Promise<void>;
  value?: string;
  invalid?: boolean;
} & Omit<ComponentProps<"input">, "defaultValue"|"onChange">;

const focusRadio = (
  value: string,
  groupRef: RefObject<HTMLDivElement | null>
) => {
  requestAnimationFrame(() => {
    const btn = groupRef.current?.querySelector(
      `[data-radio-value="${CSS.escape(String(value))}"]`
    );
    if (btn && btn instanceof HTMLElement) {
      btn.focus({ preventScroll: true });
    }
  });
};

export const RadioPrimitive = ({
  defaultValue="",
  value: controlledValue,
  disable,
  children,
  onValueChange,
  invalid,
  style,
  className,
  ...props
}: RadioPrimitiveProps) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const onValueChangeRef = useRef(onValueChange);

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const checkedValue = controlledValue ?? uncontrolledValue;

  const toggle = (newValue: string) => {
    if (disable) return;
    onValueChangeRef.current?.(newValue);
    if (!controlledValue) {
      setUncontrolledValue(newValue);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (disable) return;
    if (!groupRef.current?.contains(document.activeElement)) return;

    const currentValue = document.activeElement?.getAttribute("data-radio-value");
    const children = groupRef.current?.children;
    if (!children || children.length === 0) return;

    const values: string[] = [];
    for (let i = 0; i < children.length; i++) {
      const val = (children[i] as HTMLElement)?.getAttribute("data-radio-value");
      if (val) values.push(val);
    }

    let currentIndex = -1;
    if (currentValue) {
      currentIndex = values.findIndex((v) => v === currentValue);
    }

    let targetIndex: number;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        targetIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % values.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        targetIndex = currentIndex === -1
          ? values.length - 1
          : (currentIndex - 1 + values.length) % values.length;
        break;
      case "Home":
        targetIndex = 0;
        break;
      case "End":
        targetIndex = values.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const nextValue = values[targetIndex];
    if (nextValue) {
      toggle(nextValue);
      focusRadio(nextValue, groupRef);
    }
  };

  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  return (
    <RadioContext.Provider
      value={{
        checkedValue,
        toggle,
        uncontrolledDisable: disable,
        invalid,
      }}
    >
      <div
       {...props}
        role="radiogroup"
        aria-invalid={invalid}
        ref={groupRef}
        onKeyDown={handleKeyDown}
        style={style}
        className={className}
      >
        <input
          type="hidden"
          tabIndex={-1}
          readOnly
          value={checkedValue ?? ""}
        />
        {children}
      </div>
    </RadioContext.Provider>
  );
};
