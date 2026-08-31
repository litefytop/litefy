export default function TypographyTextDemo() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <h1 className="headline">Design System</h1>
      <p className="description">
        A set of typographic utilities for building consistent page
        hierarchies. Use <code className="heading-code">.heading-h*</code>{" "}
        classes on headings and <code className="description-code">.description</code>{" "}
        for supporting body text.
      </p>
      <p className="text-sm text-muted-foreground">
        Inline code inside body text:{" "}
        <code className="description-code">.description-code</code>
      </p>
    </div>
  );
}
