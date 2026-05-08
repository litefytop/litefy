import { Accordion } from "@/component";

export default function AccordionBasic() {
  return (
    <Accordion>
      <Accordion.Item value="item-1" title="What is React?">
        <p>React is a JavaScript library for building user interfaces.</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" title="Why Use React?">
        <p>React uses component-based development, data-driven views, and has a rich ecosystem.</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" title="How to Get Started?">
        <p>Create React App or Vite can quickly set up your project.</p>
      </Accordion.Item>
    </Accordion>
  );
}
