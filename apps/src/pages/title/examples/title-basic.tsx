import { Title } from "@/component/ui/title";

export function TitleBasic() {
  return (
    <div className="space-y-4">
      <Title as="h1">Heading 1</Title>
      <Title as="h2">Heading 2</Title>
      <Title as="h3">Heading 3</Title>
      <Title as="h4">Heading 4</Title>
      <Title as="h5">Heading 5</Title>
      <Title as="h6">Heading 6</Title>
    </div>
  );
}
