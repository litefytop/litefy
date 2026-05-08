import { Anchor } from "@/component";

export default function AnchorBasic() {
  return (
    <div className="border rounded-lg p-4 w-48">
      <Anchor>
        <Anchor.Item href="#intro">Introduction</Anchor.Item>
        <Anchor.Item href="#features">Features</Anchor.Item>
        <Anchor.Item href="#usage">Usage</Anchor.Item>
        <Anchor.Item href="#api">API Reference</Anchor.Item>
      </Anchor>
    </div>
  );
}
