export default function Demo() {
  return (
    <div className="typography mx-auto flex w-full max-w-[40em] flex-col gap-2">
      <h1>Design notes</h1>
      <h2>Voice and rhythm</h2>
      <h3>Tokens</h3>
      <h4>Sizing</h4>
      <h5>Weight</h5>
      <h6>Micro headings</h6>
      <p>
        Every role answers its own characters — size, weight and line-height — while the reading
        area adds rhythm on top. Chips like <code>--text-h1</code> and links like{" "}
        <a href="#typography">this one</a> stay in flow.
      </p>
      <ul>
        <li>Headings pick up the scheme&apos;s title voice</li>
        <li>Paragraphs and lists share one rhythm</li>
      </ul>
      <blockquote>The quote stays quiet and keeps the flow.</blockquote>
    </div>
  );
}
