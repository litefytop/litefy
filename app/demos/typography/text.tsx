import { Typography } from "@/ui";

export default function TypographyTextDemo() {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <Typography variant="headline">Design System</Typography>
      <Typography>
        A set of typographic styles for building consistent page hierarchies.
        Use <Typography variant="heading-code">heading-h*</Typography> variants
        on headings and <Typography variant="description-code">description</Typography>{" "}
        for supporting body text.
      </Typography>
      <Typography className="text-sm">
        Inline code inside body text:{" "}
        <Typography variant="description-code">description-code</Typography>
      </Typography>
    </div>
  );
}
