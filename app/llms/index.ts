export async function loader() {
  const { source } = await import("@/lib/source");
  const { llms } = await import("fumadocs-core/source");
  return new Response(llms(source).index());
}
