import { redis } from "../../../lib/redis";

export default async function PastePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const key = `paste:${id}`;

  const paste = await redis.get<any>(key);

  if (!paste) {
    return <h1>Paste not found or expired</h1>;
  }

  const now = Date.now();

  // TTL check
  if (paste.expires_at && now > paste.expires_at) {
    await redis.del(key);
    return <h1>Paste not found or expired</h1>;
  }

  // View limit check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await redis.del(key);
      return <h1>Paste not found or expired</h1>;
    }
    paste.remaining_views -= 1;
    await redis.set(key, paste);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Paste Content</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{paste.content}</pre>
    </div>
  );
}
