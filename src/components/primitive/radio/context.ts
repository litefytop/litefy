import { createContext, useContext } from "react";

export type RadioContextProps = {
  checkedValue?: string;
  toggle: (value: string) => void;
  uncontrolledDisable?: boolean;
  invalid?: boolean;
};

export const RadioContext = createContext<RadioContextProps | undefined>(
  undefined
);

export const useRadioContext = () => {
  const context = useContext(RadioContext);

  if (!context) {
    throw new Error("useRadioContext must be used within a RadioGroup component");
  }

  return context;
};
