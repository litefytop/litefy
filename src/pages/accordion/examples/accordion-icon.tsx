import { Accordion } from "@/component";
import { Plus } from "lucide-react";

export default function AccordionIcon() {
  return (
    <Accordion icon={<Plus className="w-4 h-4" />}>
      <Accordion.Item value="item-1" label="What is React?">
        <p>React is a JavaScript library for building user interfaces.</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" label="Why Use React?">
        <p>React uses component-based development, data-driven views, and has a rich ecosystem.</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" label="How to Get Started?">
        <p>Create React App or Vite can quickly set up your project.</p>
      </Accordion.Item>
    </Accordion>
  );
}
