import { nanoid } from "nanoid";
import { redis } from "../../../lib/redis";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

 const id = nanoid();

const paste = {
  content,
  remaining_views: max_views ?? null,
  expires_at: ttl_seconds ? Date.now() + ttl_seconds * 1000 : null,
};

await redis.set(`paste:${id}`, paste);


const base =
  req.headers.get("x-forwarded-host")
    ? `https://${req.headers.get("x-forwarded-host")}`
    : req.headers.get("origin") || "http://localhost:3000";

return Response.json({
  id,
  url: `${base}/p/${id}`,
});
 
}
