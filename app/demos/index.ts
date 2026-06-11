import type { ComponentType } from "react";

import SingleUncontrolledDemo from "./accordion/single-uncontrolled-demo";
import MultipleControlledDemo from "./accordion/multiple-controlled-demo";
import CustomStylingDemo from "./accordion/custom-styling-demo";

// Import all demo source codes as raw strings
import singleUncontrolledCode from "./accordion/single-uncontrolled-demo.tsx?raw";
import multipleControlledCode from "./accordion/multiple-controlled-demo.tsx?raw";
import customStylingCode from "./accordion/custom-styling-demo.tsx?raw";

export interface DemoItem {
  component: ComponentType;
  /**
   * Source code as a string.
   */
  code: string;
}

export const demos: Record<string, DemoItem> = {
  "accordion-single-uncontrolled": {
    component: SingleUncontrolledDemo,
    code: singleUncontrolledCode,
  },
  "accordion-multiple-controlled": {
    component: MultipleControlledDemo,
    code: multipleControlledCode,
  },
  "accordion-custom-styling": {
    component: CustomStylingDemo,
    code: customStylingCode,
  },
};
