import { Accordion } from "@/component";

export default function AccordionMultiple() {
  return (
    <Accordion allowMultiple>
      <Accordion.Item value="item-1" title="JavaScript">
        <p>A scripting language widely used for web development.</p>
      </Accordion.Item>
      <Accordion.Item value="item-2" title="TypeScript">
        <p>A superset of JavaScript that adds a type system.</p>
      </Accordion.Item>
      <Accordion.Item value="item-3" title="React">
        <p>A JavaScript library for building user interfaces.</p>
      </Accordion.Item>
    </Accordion>
  );
}
