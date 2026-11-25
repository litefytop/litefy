import { Callout } from "@/ui/skins";

export default function Demo() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-3">
      <Callout>This is an informational message.</Callout>
      <Callout data-variant="success">Your changes have been saved.</Callout>
      <Callout data-variant="warning">Please review your settings before continuing.</Callout>
      <Callout data-variant="danger">This action cannot be undone.</Callout>
    </div>
  );
}
