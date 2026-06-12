import type { ComponentType } from "react";
import CustomStylingDemo from "./accordion/custom-styling-demo";
import customStylingCode from "./accordion/custom-styling-demo.tsx?raw";
import MultipleControlledDemo from "./accordion/multiple-controlled-demo";
import multipleControlledCode from "./accordion/multiple-controlled-demo.tsx?raw";
import SingleUncontrolledDemo from "./accordion/single-uncontrolled-demo";
import singleUncontrolledCode from "./accordion/single-uncontrolled-demo.tsx?raw";
import ButtonBasicDemo from "./button/basic-demo";
import buttonBasicCode from "./button/basic-demo.tsx?raw";
import ButtonIconDemo from "./button/icon-demo";
import buttonIconCode from "./button/icon-demo.tsx?raw";
import ButtonLoadingDemo from "./button/loading-demo";
import buttonLoadingCode from "./button/loading-demo.tsx?raw";
import CarouselAutoplayDemo from "./carousel/autoplay-demo";
import carouselAutoplayCode from "./carousel/autoplay-demo.tsx?raw";
import CarouselBasicDemo from "./carousel/basic-demo";
import carouselBasicCode from "./carousel/basic-demo.tsx?raw";
import CheckboxBasicDemo from "./checkbox/basic-demo";
import checkboxBasicCode from "./checkbox/basic-demo.tsx?raw";
import CheckboxCustomIconDemo from "./checkbox/custom-icon-demo";
import checkboxCustomIconCode from "./checkbox/custom-icon-demo.tsx?raw";
import CheckboxToggleDemo from "./checkbox/toggle-demo";
import checkboxToggleCode from "./checkbox/toggle-demo.tsx?raw";
import ComboboxAsyncDemo from "./combobox/async-demo";
import comboboxAsyncCode from "./combobox/async-demo.tsx?raw";
import ComboboxBasicDemo from "./combobox/basic-demo";
import comboboxBasicCode from "./combobox/basic-demo.tsx?raw";
import ComboboxControlledDemo from "./combobox/controlled-demo";
import comboboxControlledCode from "./combobox/controlled-demo.tsx?raw";
import ComboboxVirtualScrollDemo from "./combobox/virtual-scroll-demo";
import comboboxVirtualScrollCode from "./combobox/virtual-scroll-demo.tsx?raw";

import DialogBasicDemo from "./dialog/basic-demo";
import dialogBasicCode from "./dialog/basic-demo.tsx?raw";

import DrawerBasicDemo from "./drawer/basic-demo";
import drawerBasicCode from "./drawer/basic-demo.tsx?raw";
import DrawerPlacementDemo from "./drawer/placement-demo";
import drawerPlacementCode from "./drawer/placement-demo.tsx?raw";

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
  "combobox-virtual-scroll": {
    component: ComboboxVirtualScrollDemo,
    code: comboboxVirtualScrollCode,
  },
  "dialog-basic": {
    component: DialogBasicDemo,
    code: dialogBasicCode,
  },
  "drawer-basic": {
    component: DrawerBasicDemo,
    code: drawerBasicCode,
  },
  "drawer-placement": {
    component: DrawerPlacementDemo,
    code: drawerPlacementCode,
  },
};
