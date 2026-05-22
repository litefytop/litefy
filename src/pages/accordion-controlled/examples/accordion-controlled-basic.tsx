import { AccordionControlled } from "@/component/ui/accordion-controlled";

export default function AccordionControlledBasic() {
  return (
    <AccordionControlled>
      <AccordionControlled.Item value="item-1" label="What is React?">
        <p>React is a JavaScript library for building user interfaces.</p>
      </AccordionControlled.Item>
      <AccordionControlled.Item value="item-2" label="What is TypeScript?">
        <p>TypeScript is a superset of JavaScript that adds a type system.</p>
      </AccordionControlled.Item>
      <AccordionControlled.Item value="item-3" label="How to Get Started?">
        <p>Create React App or Vite can quickly set up your project.</p>
      </AccordionControlled.Item>
    </AccordionControlled>
  );
}
