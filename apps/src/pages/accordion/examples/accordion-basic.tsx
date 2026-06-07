import { Accordion } from "@/component/ui/accordion";

export default function AccordionBasic() {
  return (
    <Accordion className="max-w-lg">
      <Accordion.Item value="item-1" label="What is React?">
        <p>React is a JavaScript library for building user interfaces.</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" label="What is TypeScript?">
        <p>TypeScript is a superset of JavaScript that adds a type system.</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" label="How to Get Started?">
        <p>Create React App or Vite can quickly set up your project.</p>
      </Accordion.Item>
    </Accordion>
  );
}
