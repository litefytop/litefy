import { Accordion } from "@/component/ui/accordion";

export default function AccordionDisabled() {
  return (
    <div className="space-y-4">
      <Accordion disabled>
        <Accordion.Item label="Disabled Item 1">
          <p>This item is disabled because the parent Accordion is disabled.</p>
        </Accordion.Item>
        <Accordion.Item label="Disabled Item 2">
          <p>All items are disabled and cannot be interacted with.</p>
        </Accordion.Item>
        <Accordion.Item label="Disabled Item 3">
          <p>The disabled state applies inert attribute to prevent all interactions.</p>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item label="Enabled Item">
          <p>This accordion is still enabled and functional.</p>
        </Accordion.Item>
        <Accordion.Item label="Disabled Item" disabled>
          <p>This single item is disabled while others remain enabled.</p>
        </Accordion.Item>
        <Accordion.Item label="Enabled Item">
          <p>You can still interact with this item.</p>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
