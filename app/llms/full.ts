export async function loader() {
  const { getLLMText, source } = await import("@/lib/source");
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
