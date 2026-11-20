export default function Demo() {
  return (
    <div className="flex w-full flex-col justify-center gap-2">
      <h1 className="typo-h1">Design notes</h1>
      <h2 className="typo-h2">Voice and rhythm</h2>
      <h3 className="typo-h3">Tokens</h3>
      <h4 className="typo-h4">Sizing</h4>
      <h5 className="typo-h5">Weight</h5>
      <h6 className="typo-h6">Micro headings</h6>
      <p className="typo-body">
        Every role answers its own characters — size, weight and line-height — while the reading
        area adds rhythm on top. Chips like <code className="typo-code">--text-h1</code> and links
        like{" "}
        <a className="typo-link" href="#typography">
          this one
        </a>{" "}
        stay in flow.
      </p>
      <ul className="typo-list">
        <li>Headings pick up the scheme&apos;s title voice</li>
        <li>Paragraphs and lists share one rhythm</li>
      </ul>
      <blockquote className="typo-quote">The quote stays quiet and keeps the flow.</blockquote>
    </div>
  );
}
