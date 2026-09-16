import { Callout } from "@/ui";

export default function CalloutBasicDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Callout variant="info">A block-level note for descriptions and feedback.</Callout>
      <Callout variant="success">Saved successfully. Your changes are live.</Callout>
      <Callout variant="warning">Your session expires in 5 minutes.</Callout>
      <Callout variant="danger">Upload failed. Check your connection and retry.</Callout>
    </div>
  );
}
