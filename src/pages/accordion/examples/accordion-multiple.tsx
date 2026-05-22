import { Accordion } from "@/component";

export default function AccordionMultiple() {
  return (
    <Accordion >
      <Accordion.Item name="item-1" label="JavaScript">
        <p>A scripting language widely used for web development.</p>
      </Accordion.Item>
      <Accordion.Item name="item-2" label="TypeScript">
        <p>A superset of JavaScript that adds a type system.</p>
      </Accordion.Item>
      <Accordion.Item name="item-3" label="React">
        <p>A JavaScript library for building user interfaces.</p>
      </Accordion.Item>
    </Accordion>
  );
}
