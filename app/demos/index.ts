import type { ComponentType } from "react";

import SingleUncontrolledDemo from "./accordion/single-uncontrolled-demo";
import MultipleControlledDemo from "./accordion/multiple-controlled-demo";
import CustomStylingDemo from "./accordion/custom-styling-demo";

import ButtonBasicDemo from "./button/basic-demo";
import ButtonLoadingDemo from "./button/loading-demo";
import ButtonIconDemo from "./button/icon-demo";

import CarouselBasicDemo from "./carousel/basic-demo";
import CarouselAutoplayDemo from "./carousel/autoplay-demo";

import CheckboxBasicDemo from "./checkbox/basic-demo";
import CheckboxToggleDemo from "./checkbox/toggle-demo";
import CheckboxCustomIconDemo from "./checkbox/custom-icon-demo";

import singleUncontrolledCode from "./accordion/single-uncontrolled-demo.tsx?raw";
import multipleControlledCode from "./accordion/multiple-controlled-demo.tsx?raw";
import customStylingCode from "./accordion/custom-styling-demo.tsx?raw";

import buttonBasicCode from "./button/basic-demo.tsx?raw";
import buttonLoadingCode from "./button/loading-demo.tsx?raw";
import buttonIconCode from "./button/icon-demo.tsx?raw";

import carouselBasicCode from "./carousel/basic-demo.tsx?raw";
import carouselAutoplayCode from "./carousel/autoplay-demo.tsx?raw";

import checkboxBasicCode from "./checkbox/basic-demo.tsx?raw";
import checkboxToggleCode from "./checkbox/toggle-demo.tsx?raw";
import checkboxCustomIconCode from "./checkbox/custom-icon-demo.tsx?raw";

import ComboboxBasicDemo from "./combobox/basic-demo";
import ComboboxAsyncDemo from "./combobox/async-demo";
import ComboboxControlledDemo from "./combobox/controlled-demo";

import comboboxBasicCode from "./combobox/basic-demo.tsx?raw";
import comboboxAsyncCode from "./combobox/async-demo.tsx?raw";
import comboboxControlledCode from "./combobox/controlled-demo.tsx?raw";

export interface DemoItem {
  component: ComponentType;
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
  "button-basic": {
    component: ButtonBasicDemo,
    code: buttonBasicCode,
  },
  "button-loading": {
    component: ButtonLoadingDemo,
    code: buttonLoadingCode,
  },
  "button-icon": {
    component: ButtonIconDemo,
    code: buttonIconCode,
  },
  "carousel-basic": {
    component: CarouselBasicDemo,
    code: carouselBasicCode,
  },
  "carousel-autoplay": {
    component: CarouselAutoplayDemo,
    code: carouselAutoplayCode,
  },
  "checkbox-basic": {
    component: CheckboxBasicDemo,
    code: checkboxBasicCode,
  },
  "checkbox-toggle": {
    component: CheckboxToggleDemo,
    code: checkboxToggleCode,
  },
  "checkbox-custom-icon": {
    component: CheckboxCustomIconDemo,
    code: checkboxCustomIconCode,
  },
  "combobox-basic": {
    component: ComboboxBasicDemo,
    code: comboboxBasicCode,
  },
  "combobox-async": {
    component: ComboboxAsyncDemo,
    code: comboboxAsyncCode,
  },
  "combobox-controlled": {
    component: ComboboxControlledDemo,
    code: comboboxControlledCode,
  },
};
