import { redis } from "../../../../lib/redis";
import { getNow } from "../../../../lib/time";

export async function GET(req: Request, context: any) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const paste = await redis.get<any>(key);
  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(req);

  // TTL check
  if (paste.expires_at && now > paste.expires_at) {
    await redis.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await redis.del(key);
      return Response.json({ error: "No views left" }, { status: 404 });
    }
    paste.remaining_views -= 1;
  }

  await redis.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at,
  });
}
