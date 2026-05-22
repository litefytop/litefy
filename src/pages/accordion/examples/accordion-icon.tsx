import { Accordion } from "@/component";
import { Plus } from "lucide-react";

export default function AccordionIcon() {
  return (
    <Accordion>
      <Accordion.Item name="item-1" label="What is React?"  icon={<Plus className="w-4 h-4" />}>
        <p>React is a JavaScript library for building user interfaces.</p>
      </Accordion.Item>
      <Accordion.Item name="item-1" label="Why Use React?"  icon={<Plus className="w-4 h-4" />}>
        <p>React uses component-based development, data-driven views, and has a rich ecosystem.</p>
      </Accordion.Item>
      <Accordion.Item name="item-1" label="How to Get Started?"  icon={<Plus className="w-4 h-4" />}>
        <p>Create React App or Vite can quickly set up your project.</p>
      </Accordion.Item>
    </Accordion>
  );
}
