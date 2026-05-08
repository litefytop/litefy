import { Anchor } from "@/component";

export default function AnchorWithSections() {
  return (
    <div className="border rounded-lg p-4 w-56">
      <Anchor>
        <Anchor.Section href="#intro" title="Introduction" />
        <Anchor.Section title="Features">
          <Anchor.Item href="#feature1">Feature 1</Anchor.Item>
          <Anchor.Item href="#feature2">Feature 2</Anchor.Item>
          <Anchor.Item href="#feature3">Feature 3</Anchor.Item>
        </Anchor.Section>
        <Anchor.Section href="#usage" title="Usage" />
        <Anchor.Section href="#api" title="API" />
      </Anchor>
    </div>
  );
}
