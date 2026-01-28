export default async function PastePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const base =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const res = await fetch(`${base}/api/pastes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <h1>Paste not found or expired</h1>;
  }

  const data = await res.json();

  return (
    <div style={{ padding: 40 }}>
      <h1>Paste Content</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{data.content}</pre>
    </div>
  );
}
